<?php
/**
 * Backend for the hosted site editor.
 *
 * Reads and writes the two JSON files the site fetches at runtime, and saves
 * uploaded photos. Every response is JSON; every state-changing call needs a
 * signed-in session and a matching CSRF token.
 *
 * The password hash and the session store live OUTSIDE the web root, so no
 * request can fetch them even if something else here is wrong.
 */

declare(strict_types=1);

// ---------------------------------------------------------------- paths ----

$docroot  = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)), '/');
// The account home, two levels up: this domain is an addon, so ONE level up
// is public_html -- another site's document root, not a private directory.
$private  = dirname($docroot, 2);
$credFile = $private . '/.site-editor.json';
$content  = $docroot . '/content';
$images   = $docroot . '/images';

const UPLOAD_DIRS   = ['' => 1, 'blog' => 1, 'testimonials' => 1];
const MAX_BODY      = 24 * 1024 * 1024;   // a resized photo is far below this
const MAX_ATTEMPTS  = 6;
const LOCKOUT_MINS  = 15;
const SESSION_HOURS = 12;

// -------------------------------------------------------------- helpers ----

function send(int $code, array $body): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
    if ($raw === false || strlen($raw) > MAX_BODY) send(413, ['error' => 'That was too large to save']);
    $d = json_decode($raw ?: '{}', true);
    return is_array($d) ? $d : [];
}

/** Written via a temp file and renamed, so a failed write cannot truncate. */
function put_atomic(string $path, string $data): void {
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $data, LOCK_EX) === false) send(500, ['error' => 'Could not write ' . basename($path)]);
    if (!rename($tmp, $path)) { @unlink($tmp); send(500, ['error' => 'Could not replace ' . basename($path)]); }
}

function creds(string $file): ?array {
    if (!is_file($file)) return null;
    $d = json_decode((string) file_get_contents($file), true);
    return is_array($d) && isset($d['user'], $d['hash']) ? $d : null;
}

// -------------------------------------------------------------- session ----

session_set_cookie_params([
    'lifetime' => SESSION_HOURS * 3600,
    'path'     => '/admin',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_name('editor_sid');
session_save_path($private);
session_start();

$signedIn = !empty($_SESSION['ok']) && ($_SESSION['exp'] ?? 0) > time();
if (!$signedIn) $_SESSION['ok'] = false;
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));

function require_session(bool $signedIn): void {
    if (!$signedIn) send(401, ['error' => 'Please sign in again']);
    $sent = $_SERVER['HTTP_X_CSRF'] ?? '';
    if (!hash_equals((string) $_SESSION['csrf'], (string) $sent)) {
        send(403, ['error' => 'This page went stale. Reload and try again.']);
    }
}

// --------------------------------------------------------------- routes ----

$a = (string) ($_GET['a'] ?? '');
$existing = creds($credFile);

if ($a === 'session') {
    send(200, ['signedIn' => $signedIn, 'needsSetup' => $existing === null, 'csrf' => $_SESSION['csrf']]);
}

if ($a === 'setup') {
    // Only reachable while no login exists, so it cannot overwrite one.
    if ($existing !== null) send(409, ['error' => 'A login already exists']);
    $d = body();
    $user = trim((string) ($d['username'] ?? ''));
    $pass = (string) ($d['password'] ?? '');
    if (strlen($user) < 2)  send(400, ['error' => 'Choose a username of at least 2 characters']);
    if (strlen($pass) < 10) send(400, ['error' => 'Choose a password of at least 10 characters']);
    put_atomic($credFile, json_encode([
        'user' => $user,
        'hash' => password_hash($pass, PASSWORD_DEFAULT),
    ], JSON_PRETTY_PRINT));
    @chmod($credFile, 0600);
    session_regenerate_id(true);
    $_SESSION['ok'] = true;
    $_SESSION['exp'] = time() + SESSION_HOURS * 3600;
    send(200, ['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

if ($a === 'login') {
    if ($existing === null) send(400, ['error' => 'No login has been set up yet']);

    // Attempt counter lives beside the hash, so it survives a new session.
    $lockFile = $private . '/.site-editor-attempts.json';
    $lock = is_file($lockFile) ? json_decode((string) file_get_contents($lockFile), true) : [];
    $fails = (int) ($lock['n'] ?? 0);
    $until = (int) ($lock['until'] ?? 0);
    if ($until > time()) {
        send(429, ['error' => 'Too many attempts. Try again in ' . (int) ceil(($until - time()) / 60) . ' minutes.']);
    }

    $d = body();
    $userOk = hash_equals($existing['user'], (string) ($d['username'] ?? ''));
    $passOk = password_verify((string) ($d['password'] ?? ''), $existing['hash']);

    if (!$userOk || !$passOk) {
        $fails++;
        $next = ['n' => $fails, 'until' => $fails >= MAX_ATTEMPTS ? time() + LOCKOUT_MINS * 60 : 0];
        if ($fails >= MAX_ATTEMPTS) $next['n'] = 0;
        put_atomic($lockFile, json_encode($next));
        // Same message either way, so neither field can be probed.
        send(401, ['error' => 'Wrong username or password']);
    }

    @unlink($lockFile);
    session_regenerate_id(true);
    $_SESSION['ok'] = true;
    $_SESSION['exp'] = time() + SESSION_HOURS * 3600;
    send(200, ['ok' => true, 'csrf' => $_SESSION['csrf']]);
}

if ($a === 'logout') {
    $_SESSION = [];
    session_destroy();
    send(200, ['ok' => true]);
}

if ($a === 'data') {
    require_session($signedIn);
    $out = [];
    foreach (['content' => 'content.json', 'posts' => 'posts.json'] as $key => $file) {
        $raw = @file_get_contents($content . '/' . $file);
        if ($raw === false) send(500, ['error' => "Could not read $file"]);
        $out[$key] = json_decode($raw, true);
    }
    send(200, $out);
}

if ($a === 'save') {
    require_session($signedIn);
    $d = body();
    if (!isset($d['content']) || !is_array($d['content']) || !isset($d['posts']) || !is_array($d['posts'])) {
        send(400, ['error' => 'Expected content and posts']);
    }
    // Refuse to write something the site cannot render.
    foreach (['site', 'nav', 'hero', 'about', 'testimonials', 'faqs'] as $k) {
        if (!isset($d['content'][$k])) send(400, ['error' => "Content is missing \"$k\"; nothing was saved"]);
    }
    $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
    put_atomic($content . '/content.json', json_encode($d['content'], $flags) . "\n");
    put_atomic($content . '/posts.json',   json_encode($d['posts'],   $flags) . "\n");
    send(200, ['ok' => true, 'savedAt' => gmdate('c')]);
}

if ($a === 'upload') {
    require_session($signedIn);
    $d = body();
    $dir = (string) ($d['dir'] ?? '');
    if (!isset(UPLOAD_DIRS[$dir])) send(400, ['error' => 'Unknown folder']);

    if (!preg_match('#^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$#', (string) ($d['dataUrl'] ?? ''), $m)) {
        send(400, ['error' => 'Expected a JPEG, PNG or WebP image']);
    }
    $bytes = base64_decode($m[2], true);
    if ($bytes === false || strlen($bytes) < 64) send(400, ['error' => 'That image could not be read']);

    // Trust the bytes, not the declared type.
    $info = @getimagesizefromstring($bytes);
    if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        send(400, ['error' => 'That file is not a real image']);
    }
    $ext = [IMAGETYPE_JPEG => '.jpg', IMAGETYPE_PNG => '.png', IMAGETYPE_WEBP => '.webp'][$info[2]];

    // Built here from scratch, so nothing the caller sends can escape the folder.
    $stem = strtolower(pathinfo((string) ($d['name'] ?? 'image'), PATHINFO_FILENAME));
    $stem = trim(preg_replace('/[^a-z0-9]+/', '-', $stem) ?? '', '-');
    $file = substr($stem === '' ? 'image' : $stem, 0, 60) . $ext;

    $folder = $images . ($dir === '' ? '' : '/' . $dir);
    if (!is_dir($folder) && !mkdir($folder, 0755, true)) send(500, ['error' => 'Could not create the folder']);
    if (file_put_contents($folder . '/' . $file, $bytes, LOCK_EX) === false) {
        send(500, ['error' => 'Could not save the image']);
    }
    send(200, ['path' => '/images/' . ($dir === '' ? '' : $dir . '/') . $file]);
}

send(404, ['error' => 'Unknown action']);
