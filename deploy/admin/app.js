/* Generated from tools/admin/ui by scripts/build-admin.mjs — do not edit here. */
import { blocksToText, textToBlocks, paragraphsToText, textToParagraphs, slugify } from './blocks.js'

const PREVIEW_ORIGIN = '..'  // the site sits one level above /admin/

let data = null      // { content, posts } -- the working copy
let original = null  // the last saved state, for Undo
let tab = 'blog'
let dirty = false

const $ = (id) => document.getElementById(id)
const el = (tag, props = {}, kids = []) => {
  const n = Object.assign(document.createElement(tag), props)
  for (const k of [].concat(kids)) if (k != null) n.append(k)
  return n
}

/* ---------------------------------------------------------------- state -- */

function markDirty() {
  dirty = true
  $('save').disabled = false
  $('revert').disabled = false
  $('status').textContent = 'Unsaved changes'
  $('status').className = 'status status--dirty'
}

function markClean(msg = 'All changes saved') {
  dirty = false
  $('save').disabled = true
  $('revert').disabled = true
  $('status').textContent = msg
  $('status').className = 'status'
}

function toast(msg, isError = false) {
  const t = el('div', { className: `toast${isError ? ' toast--error' : ''}`, textContent: msg })
  document.body.append(t)
  setTimeout(() => t.remove(), isError ? 5000 : 2200)
}

/* ---------------------------------------------------------------- fields -- */

function field(label, control, help) {
  return el('div', { className: 'field' }, [
    el('label', {}, [label, help ? el('span', { className: 'help', textContent: ` — ${help}` }) : null]),
    control,
  ])
}

function text(obj, key, { label, help, type = 'text' } = {}) {
  const input = el('input', { type, value: obj[key] ?? '' })
  input.addEventListener('input', () => { obj[key] = input.value; markDirty() })
  return field(label, input, help)
}

function area(obj, key, { label, help, rows = 4, get, set } = {}) {
  const ta = el('textarea', { rows, value: get ? get(obj) : (obj[key] ?? '') })
  ta.addEventListener('input', () => {
    if (set) set(obj, ta.value)
    else obj[key] = ta.value
    markDirty()
  })
  return field(label, ta, help)
}

/**
 * Photos are resized in the browser before upload, so the repo never gains a
 * 4MB phone snapshot to serve a 52px avatar.
 */
function resize(file, max) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h })
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.86))
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error('That file could not be read as an image'))
    img.src = URL.createObjectURL(file)
  })
}

function image(obj, key, { label, dir = '', max = 1600, help } = {}) {
  const preview = el('img', { src: obj[key] ? PREVIEW_ORIGIN + obj[key] : '', alt: '' })
  const pathLine = el('div', { className: 'imgfield__path', textContent: obj[key] || 'No image' })
  const input = el('input', { type: 'file', accept: 'image/*' })

  input.addEventListener('change', async () => {
    const file = input.files[0]
    if (!file) return
    try {
      const dataUrl = await resize(file, max)
      const res = await api('upload', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: file.name, dir, dataUrl }),
      })
      const out = await res.json()
      if (!res.ok) throw new Error(out.error || 'Upload failed')
      obj[key] = out.path
      preview.src = `${PREVIEW_ORIGIN}${out.path}?t=${Date.now()}`
      pathLine.textContent = out.path
      markDirty()
      toast('Photo uploaded')
    } catch (err) {
      toast(err.message, true)
    } finally {
      input.value = ''
    }
  })

  return field(label, el('div', { className: 'imgfield' }, [
    preview,
    el('div', { className: 'imgfield__side' }, [input, pathLine]),
  ]), help)
}

/* ------------------------------------------------------------ list cards -- */

function card(title, thumbSrc, body, { onUp, onDown, onDelete, open = false } = {}) {
  const wrap = el('div', { className: `card${open ? '' : ' collapsed'}` })
  const chev = el('span', { className: 'chev', textContent: open ? 'v' : '>' })
  const head = el('div', { className: 'card__head' }, [
    chev,
    thumbSrc !== null
      ? el('img', { className: 'thumb', src: thumbSrc ? PREVIEW_ORIGIN + thumbSrc : '', alt: '' })
      : null,
    el('h3', { textContent: title || '(untitled)' }),
  ])
  head.addEventListener('click', () => {
    wrap.classList.toggle('collapsed')
    chev.textContent = wrap.classList.contains('collapsed') ? '>' : 'v'
  })

  const inner = el('div', { className: 'card__body' }, body)
  inner.append(el('div', { className: 'rowbtns' }, [
    onUp ? el('button', { className: 'mini', textContent: 'Move up', onclick: onUp }) : null,
    onDown ? el('button', { className: 'mini', textContent: 'Move down', onclick: onDown }) : null,
    onDelete ? el('button', { className: 'mini mini--danger', textContent: 'Delete', onclick: onDelete }) : null,
  ]))
  wrap.append(head, inner)
  return wrap
}

function listControls(arr, i) {
  const move = (to) => () => { arr.splice(to, 0, arr.splice(i, 1)[0]); markDirty(); render() }
  return {
    onUp: i > 0 ? move(i - 1) : null,
    onDown: i < arr.length - 1 ? move(i + 1) : null,
    onDelete: () => {
      if (!confirm('Delete this entry? It leaves the site when you save.')) return
      arr.splice(i, 1)
      markDirty()
      render()
    },
  }
}

/* -------------------------------------------------------------- sections -- */

function heading(title, hint) {
  return [
    el('h2', { className: 'section-title', textContent: title }),
    el('p', { className: 'section-hint', textContent: hint }),
  ]
}

const SECTIONS = {
  blog: () => {
    const posts = data.posts
    const nodes = heading('Blog posts', 'Newest first. The home page shows the top three.')
    posts.forEach((post, i) => {
      nodes.push(card(post.title, post.image, [
        text(post, 'title', { label: 'Title' }),
        el('div', { className: 'row' }, [
          text(post, 'date', { label: 'Date', type: 'date' }),
          text(post, 'slug', { label: 'Web address', help: 'changing it breaks old links' }),
        ]),
        area(post, 'excerpt', { label: 'Excerpt', help: 'the teaser on the blog list', rows: 3 }),
        image(post, 'image', { label: 'Cover photo', dir: 'blog', max: 1400 }),
        area(post, 'body', {
          label: 'Article',
          help: 'blank line between paragraphs, "## " heading, "> " quote, "- " list item',
          rows: 18,
          get: (p) => blocksToText(p.body),
          set: (p, v) => { p.body = textToBlocks(v) },
        }),
        text(post, 'source', { label: 'Original article link', help: 'optional' }),
      ], listControls(posts, i)))
    })
    nodes.push(el('button', {
      className: 'addbtn',
      textContent: '+ Add a blog post',
      onclick: () => {
        posts.unshift({
          slug: '',
          title: 'New post',
          date: new Date().toISOString().slice(0, 10),
          excerpt: '',
          image: '',
          source: '',
          body: [{ t: 'p', text: '' }],
        })
        markDirty()
        render()
      },
    }))
    return nodes
  },

  testimonials: () => {
    const list = data.content.testimonials
    const nodes = heading('Testimonials', 'Leave the photo empty to show the person’s initials instead.')
    list.forEach((t, i) => {
      nodes.push(card(t.name, t.photo, [
        text(t, 'name', { label: 'Name' }),
        text(t, 'role', { label: 'Role', help: 'optional' }),
        text(t, 'date', { label: 'Date', help: 'shown as written, e.g. "July 28, 2025". Optional' }),
        image(t, 'photo', { label: 'Photo', dir: 'testimonials', max: 300 }),
        text(t, 'rating', { label: 'Stars', help: '0 hides them', type: 'number' }),
        area(t, 'quote', {
          label: 'Quote',
          help: 'blank line between paragraphs',
          rows: 7,
          get: (x) => paragraphsToText(x.quote),
          set: (x, v) => { x.quote = textToParagraphs(v) },
        }),
      ], listControls(list, i)))
    })
    nodes.push(el('button', {
      className: 'addbtn',
      textContent: '+ Add a testimonial',
      onclick: () => {
        list.push({ name: '', role: '', date: '', photo: '', rating: 0, quote: [''] })
        markDirty()
        render()
      },
    }))
    return nodes
  },

  faqs: () => {
    const list = data.content.faqs
    const nodes = heading('FAQs', 'Shown in this order. Only the questions are visible until clicked.')
    nodes.push(text(data.content, 'faqHeading', { label: 'Page heading' }))
    nodes.push(area(data.content, 'faqIntro', { label: 'Intro line', rows: 2 }))
    list.forEach((f, i) => {
      nodes.push(card(f.q, null, [
        area(f, 'q', { label: 'Question', rows: 2 }),
        area(f, 'a', { label: 'Answer', rows: 6 }),
      ], listControls(list, i)))
    })
    nodes.push(el('button', {
      className: 'addbtn',
      textContent: '+ Add a question',
      onclick: () => { list.push({ q: '', a: '' }); markDirty(); render() },
    }))
    return nodes
  },

  about: () => {
    const a = data.content.about
    return [
      ...heading('About Amy', 'The portrait and the biography beside it.'),
      el('div', { className: 'card' }, [
        image(a, 'portrait', { label: 'Portrait', dir: '', max: 900 }),
        text(a, 'name', { label: 'Name' }),
        text(a, 'credentials', { label: 'Credentials line' }),
        area(a, 'lede', { label: 'Opening statement', rows: 3 }),
        area(a, 'body', {
          label: 'Biography',
          help: 'blank line between paragraphs',
          rows: 16,
          get: (x) => paragraphsToText(x.body),
          set: (x, v) => { x.body = textToParagraphs(v) },
        }),
        text(a, 'philosophyLead', { label: 'Philosophy lead-in' }),
        area(a, 'philosophy', { label: 'Philosophy pull-quote', rows: 3 }),
        area(a, 'closing', { label: 'Closing paragraph', rows: 3 }),
      ]),
    ]
  },

  home: () => {
    const c = data.content
    const listSection = (title, arr, fields) => {
      const nodes = [el('h2', { className: 'section-title', textContent: title })]
      arr.forEach((item, i) => {
        nodes.push(card(item.title, null, fields(item), listControls(arr, i)))
      })
      return nodes
    }
    return [
      ...heading('Home page', 'Headline wording, the hero photo, and the lists below it.'),
      el('div', { className: 'card' }, [
        el('h3', { textContent: 'Hero', style: 'margin:0 0 12px' }),
        image(c.hero, 'photo', { label: 'Hero photo', dir: '', max: 1800 }),
        text(c.hero, 'eyebrow', { label: 'Eyebrow' }),
        el('div', { className: 'row' }, [
          text(c.hero, 'titleLine1', { label: 'Headline line 1' }),
          text(c.hero, 'titleLine2', { label: 'Headline line 2', help: 'shown in gold' }),
        ]),
        area(c.hero, 'text', { label: 'Sub-heading', rows: 2 }),
      ]),
      el('div', { className: 'card' }, [
        el('h3', { textContent: 'Banner', style: 'margin:0 0 12px' }),
        text(c.banner, 'titleLine1', { label: 'Line 1' }),
        text(c.banner, 'titleLine2', { label: 'Line 2' }),
        text(c.banner, 'titleLine3', { label: 'Line 3', help: 'shown in gold' }),
        area(c.banner, 'text', { label: 'Text', rows: 2 }),
        text(c.banner, 'cta', { label: 'Button label' }),
      ]),
      text(c, 'servicesHeading', { label: 'Services heading' }),
      ...listSection('Services', c.services, (s) => [
        text(s, 'title', { label: 'Title' }),
        area(s, 'blurb', { label: 'Description', rows: 2 }),
        text(s, 'slug', { label: 'Key', help: 'used internally' }),
      ]),
      ...listSection('Who I work with', c.audiences, (s) => [
        text(s, 'title', { label: 'Title' }),
        area(s, 'blurb', { label: 'Description', rows: 2 }),
        text(s, 'slug', { label: 'Key', help: 'used internally' }),
      ]),
      text(c, 'approachHeading', { label: 'Approach heading' }),
      ...listSection('Approach steps', c.approach, (s) => [
        text(s, 'n', { label: 'Number' }),
        text(s, 'title', { label: 'Title' }),
        area(s, 'text', { label: 'Text', rows: 2 }),
      ]),
      el('div', { className: 'card' }, [
        el('h3', { textContent: 'Closing band', style: 'margin:0 0 12px' }),
        text(c.closing, 'titleLine1', { label: 'Line 1' }),
        text(c.closing, 'titleLine2', { label: 'Line 2', help: 'shown in gold' }),
        area(c.closing, 'text', { label: 'Text', rows: 2 }),
      ]),
    ]
  },
}

const TABS = [
  ['blog', 'Blog'],
  ['testimonials', 'Testimonials'],
  ['faqs', 'FAQs'],
  ['about', 'About'],
  ['home', 'Home'],
]

/* ---------------------------------------------------------------- render -- */

function render() {
  const editor = $('editor')
  const top = editor.scrollTop
  editor.replaceChildren(...SECTIONS[tab]())
  editor.scrollTop = top

  $('tabs').replaceChildren(...TABS.map(([key, label]) => el('button', {
    textContent: label,
    className: key === tab ? 'active' : '',
    onclick: () => { tab = key; render() },
  })))
}

/* ------------------------------------------------------------------- io -- */

let csrf = ''

/** Any call can come back 401 once the session lapses; send the user to sign in. */
async function api(action, options = {}) {
  const res = await fetch(`api.php?a=${action}`, {
    credentials: 'same-origin',
    ...options,
    headers: { ...(options.headers || {}), 'X-CSRF': csrf },
  })
  if (res.status === 401) {
    location.replace('login.php')
    throw new Error('Session expired')
  }
  return res
}

async function load() {
  const res = await api('data')
  if (!res.ok) throw new Error('Could not read the content files')
  data = await res.json()
  original = structuredClone(data)
  render()
  markClean('Loaded')
}

async function save() {
  $('save').disabled = true
  try {
    // The URL of a post is built from its slug, so never let one go empty.
    for (const p of data.posts) if (!String(p.slug).trim()) p.slug = slugify(p.title) || 'post'
    for (const t of data.content.testimonials) t.rating = Number(t.rating) || 0

    const res = await api('save', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    const out = await res.json()
    if (!res.ok) throw new Error(out.error || 'Save failed')

    original = structuredClone(data)
    render()
    markClean('Saved. Preview reloading')
    // Vite reloads on the JSON change by itself; this covers a replaced photo,
    // where the file name can stay the same and the browser would reuse it.
    setTimeout(reloadPreview, 500)
  } catch (err) {
    $('save').disabled = false
    $('status').textContent = 'Save failed'
    $('status').className = 'status status--error'
    toast(err.message, true)
  }
}

function reloadPreview() {
  $('preview').src = `${PREVIEW_ORIGIN}${$('previewPage').value}?t=${Date.now()}`
}

/* ----------------------------------------------------------------- boot -- */

$('signout').addEventListener('click', async () => {
  if (dirty && !confirm('You have unsaved changes. Sign out anyway?')) return
  dirty = false
  await fetch('api.php?a=logout', { method: 'POST', credentials: 'same-origin' })
  location.replace('login.php')
})
$('save').addEventListener('click', save)
$('revert').addEventListener('click', () => {
  if (!confirm('Discard every change since the last save?')) return
  data = structuredClone(original)
  render()
  markClean('Reverted')
})
$('previewPage').addEventListener('change', reloadPreview)
$('reload').addEventListener('click', reloadPreview)

window.addEventListener('beforeunload', (e) => {
  if (dirty) { e.preventDefault(); e.returnValue = '' }
})

reloadPreview()
fetch('api.php?a=session', { credentials: 'same-origin' })
  .then((r) => r.json())
  .then((s) => {
    if (!s.signedIn) return location.replace('login.php')
    csrf = s.csrf
    return load()
  })
  .catch((err) => {
  $('status').textContent = 'Could not load content'
  $('status').className = 'status status--error'
  toast(err.message, true)
})
