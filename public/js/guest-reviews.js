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
  const cardsContainer = document.getElementById('entries-cards')
  const emptyState = document.getElementById('entries-empty')
  const checkInInput = entryForm.querySelector('[name="checkIn"]')
  const checkOutInput = entryForm.querySelector('[name="checkOut"]')
  const nightsInput = entryForm.querySelector('[name="nights"]')

  const FIELD_LABELS = {
    guests: 'Number of Guests',
    welcomeGift: 'Welcome Gift',
    occasion: 'Occasion',
    payout: 'Payout',
    payment: 'Payment',
    phone: 'Phone'
  }

  const TEXT_FIELD_LABELS = {
    additionalInfo: 'Additional Information',
    comments: 'Comments'
  }

  let entries = []
  let openCardId = null

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
      renderCards()
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
    renderCards()
  }

  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str ?? ''
    return div.innerHTML
  }

  function renderCards() {
    cardsContainer.innerHTML = ''
    emptyState.style.display = entries.length ? 'none' : 'block'

    entries.forEach((entry) => {
      const card = document.createElement('div')
      card.className = 'gr-card'
      if (entry.id === openCardId) card.classList.add('open')

      const rating = Number(entry.rating) || 0
      const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '—'
      const dateRange = [entry.checkIn, entry.checkOut].filter(Boolean).join(' → ')

      const fieldRows = Object.entries(FIELD_LABELS)
        .map(([key, label]) => {
          const value = entry[key]
          if (!value) return ''
          return `
            <div class="gr-card-field">
              <span class="gr-card-field-label">${escapeHtml(label)}</span>
              <span class="gr-card-field-value">${escapeHtml(value)}</span>
            </div>
          `
        })
        .join('')

      const textBlocks = Object.entries(TEXT_FIELD_LABELS)
        .map(([key, label]) => {
          const value = entry[key]
          if (!value) return ''
          return `
            <div class="gr-card-text">
              <div class="gr-card-field-label">${escapeHtml(label)}</div>
              <div class="gr-card-text-value">${escapeHtml(value)}</div>
            </div>
          `
        })
        .join('')

      card.innerHTML = `
        <div class="gr-card-header">
          <div>
            <div class="gr-card-name">${escapeHtml(entry.name) || 'Unnamed Guest'}</div>
            <div class="gr-card-subtitle">
              <span>${escapeHtml(dateRange)}</span>
              ${entry.nights ? `<span>· ${escapeHtml(entry.nights)} nights</span>` : ''}
              ${entry.platform ? `<span class="gr-card-tag">${escapeHtml(entry.platform)}</span>` : ''}
            </div>
          </div>
          <div class="gr-card-rating">${stars}</div>
        </div>
        <div class="gr-card-hint">${entry.id === openCardId ? 'Tap to collapse' : 'Tap to view details'}</div>
        <div class="gr-card-body">
          ${fieldRows}
          ${textBlocks}
          <div class="gr-card-actions">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </div>
        </div>
      `

      card.addEventListener('click', () => {
        openCardId = openCardId === entry.id ? null : entry.id
        renderCards()
      })

      card.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation()
        openForm(entry)
      })
      card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
        e.stopPropagation()
        deleteEntry(entry.id)
      })

      cardsContainer.appendChild(card)
    })
  }

  async function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      if (openCardId === id) openCardId = null
      loadEntries()
    }
  }

  checkSession()
})()
