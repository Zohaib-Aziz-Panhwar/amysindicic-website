const $ = (id) => document.getElementById(id)

// The first run has no login yet, so the same form creates one instead.
let needsSetup = false

const showError = (msg) => {
  $('error').textContent = msg
  $('error').hidden = !msg
}

async function init() {
  try {
    const res = await fetch('/api/session')
    const s = await res.json()
    if (s.signedIn) return location.replace('/')
    needsSetup = s.needsSetup
  } catch {
    return showError('The editor is not responding. Is `npm run admin` still running?')
  }

  if (needsSetup) {
    $('title').textContent = 'Choose a login'
    $('sub').textContent = 'This is the first run. Pick a username and password for the editor.'
    $('passwordLabel').innerHTML = 'Password <span class="help">— at least 8 characters</span>'
    $('password').autocomplete = 'new-password'
    $('submit').textContent = 'Create login'
  }
}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  showError('')
  $('submit').disabled = true
  try {
    const res = await fetch(needsSetup ? '/api/setup' : '/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: $('username').value, password: $('password').value }),
    })
    const out = await res.json()
    if (!res.ok) throw new Error(out.error || 'Sign in failed')
    location.replace('/')
  } catch (err) {
    showError(err.message)
    $('password').value = ''
    $('password').focus()
    $('submit').disabled = false
  }
})

init()
