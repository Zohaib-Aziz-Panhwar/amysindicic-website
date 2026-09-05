<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign in — Site Editor</title>
  <link rel="stylesheet" href="admin.css" />
  <style>
    body { display: grid; place-items: center; min-height: 100vh; background: #001125; }
    .login {
      width: min(380px, 92vw); background: #fff; border-radius: 8px;
      padding: 30px 30px 26px; box-shadow: 0 30px 70px rgba(0, 0, 0, .45);
    }
    .login h1 { margin: 0 0 4px; font-size: 19px; }
    .login p.sub { margin: 0 0 20px; color: var(--muted); font-size: 13px; }
    .login .btn { width: 100%; padding: 11px; margin-top: 6px; }
    .err {
      background: #fdecec; border: 1px solid #f3bcbc; color: #a01c22;
      border-radius: 4px; padding: 9px 11px; font-size: 13px; margin-bottom: 14px;
    }
    .rule { height: 3px; width: 54px; margin: 0 0 18px; border: 0;
      background: linear-gradient(90deg, var(--gold), rgba(247, 179, 36, .3)); }
  </style>
</head>
<body>
  <form class="login" id="form">
    <h1 id="title">Site Editor</h1>
    <p class="sub" id="sub">Sign in to edit the site.</p>
    <hr class="rule" />

    <div class="err" id="error" hidden></div>

    <div class="field">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="username" autofocus required />
    </div>
    <div class="field">
      <label for="password" id="passwordLabel">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required />
    </div>

    <button class="btn" id="submit" type="submit">Sign in</button>
  </form>

  <script type="module" src="login.js"></script>
</body>
</html>
