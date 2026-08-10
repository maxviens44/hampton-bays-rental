(function () {
  const API = '/.netlify/functions/reviews'

  const loginScreen = document.getElementById('login-screen')
  const appScreen = document.getElementById('app-screen')
  const loginForm = document.getElementById('login-form')
  const loginError = document.getElementById('login-error')
  const logoutBtn = document.getElementById('logout-btn')
  const newEntryBtn = document.getElementById('new-entry-btn')
  const cancelEntryBtn = document.getElementById('cancel-entry-btn')
  const entryFormWrap = document.getElementById('entry-form-wrap')
  const entryForm = document.getElementById('entry-form')
  const entryFormTitle = document.getElementById('entry-form-title')
  const tbody = document.getElementById('entries-tbody')
  const emptyState = document.getElementById('entries-empty')
  const checkInInput = entryForm.querySelector('[name="checkIn"]')
  const checkOutInput = entryForm.querySelector('[name="checkOut"]')
  const nightsInput = entryForm.querySelector('[name="nights"]')

  let entries = []

  function showApp() {
    loginScreen.style.display = 'none'
    appScreen.style.display = 'block'
    loadEntries()
  }

  function showLogin() {
    appScreen.style.display = 'none'
    loginScreen.style.display = 'block'
  }

  async function checkSession() {
    const res = await fetch(API, { method: 'GET' })
    if (res.ok) {
      const data = await res.json()
      entries = data.entries || []
      showApp()
      renderTable()
    } else {
      showLogin()
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    loginError.style.display = 'none'
    const password = loginForm.password.value
    const res = await fetch('/.netlify/functions/reviews-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (res.ok) {
      loginForm.reset()
      checkSession()
    } else {
      loginError.style.display = 'block'
    }
  })

  logoutBtn.addEventListener('click', async () => {
    await fetch('/.netlify/functions/reviews-logout', { method: 'POST' })
    showLogin()
  })

  function calcNights() {
    const inVal = checkInInput.value
    const outVal = checkOutInput.value
    if (!inVal || !outVal) {
      nightsInput.value = ''
      return
    }
    const inDate = new Date(inVal)
    const outDate = new Date(outVal)
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))
    nightsInput.value = diff > 0 ? diff : ''
  }

  checkInInput.addEventListener('change', calcNights)
  checkOutInput.addEventListener('change', calcNights)

  function openForm(entry) {
    entryForm.reset()
    if (entry) {
      entryFormTitle.textContent = 'Edit Entry'
      entryForm.elements['id'].value = entry.id
      for (const [key, value] of Object.entries(entry)) {
        const field = entryForm.elements[key]
        if (field) field.value = value ?? ''
      }
    } else {
      entryFormTitle.textContent = 'New Entry'
      entryForm.elements['id'].value = ''
    }
    entryFormWrap.classList.add('open')
    entryFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function closeForm() {
    entryFormWrap.classList.remove('open')
    entryForm.reset()
  }

  newEntryBtn.addEventListener('click', () => openForm(null))
  cancelEntryBtn.addEventListener('click', closeForm)

  entryForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(entryForm)
    const payload = Object.fromEntries(formData.entries())
    const id = payload.id
    delete payload.id

    const res = await fetch(API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id ? { ...payload, id } : payload)
    })

    if (res.ok) {
      closeForm()
      loadEntries()
    }
  })

  async function loadEntries() {
    const res = await fetch(API, { method: 'GET' })
    if (!res.ok) {
      showLogin()
      return
    }
    const data = await res.json()
    entries = data.entries || []
    renderTable()
  }

  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str ?? ''
    return div.innerHTML
  }

  function renderTable() {
    tbody.innerHTML = ''
    emptyState.style.display = entries.length ? 'none' : 'block'

    entries.forEach((entry) => {
      const tr = document.createElement('tr')
      const rating = Number(entry.rating) || 0
      const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '—'

      tr.innerHTML = `
        <td>${escapeHtml(entry.name)}</td>
        <td>${escapeHtml(entry.checkIn)}</td>
        <td>${escapeHtml(entry.checkOut)}</td>
        <td>${escapeHtml(entry.nights)}</td>
        <td>${escapeHtml(entry.platform)}</td>
        <td>${escapeHtml(entry.guests)}</td>
        <td>${escapeHtml(entry.welcomeGift)}</td>
        <td>${escapeHtml(entry.occasion)}</td>
        <td>${escapeHtml(entry.payout)}</td>
        <td>${escapeHtml(entry.additionalInfo)}</td>
        <td>${escapeHtml(entry.payment)}</td>
        <td>${escapeHtml(entry.comments)}</td>
        <td>${escapeHtml(entry.phone)}</td>
        <td class="rating">${stars}</td>
        <td>
          <div class="gr-row-actions">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </div>
        </td>
      `

      tr.querySelector('[data-action="edit"]').addEventListener('click', () => openForm(entry))
      tr.querySelector('[data-action="delete"]').addEventListener('click', () => deleteEntry(entry.id))

      tbody.appendChild(tr)
    })
  }

  async function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) loadEntries()
  }

  checkSession()
})()
