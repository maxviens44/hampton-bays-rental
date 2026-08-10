(function () {
  const API = '/.netlify/functions/reviews'

  const loginScreen = document.getElementById('login-screen')
  const appScreen = document.getElementById('app-screen')
  const loginForm = document.getElementById('login-form')
  const loginError = document.getElementById('login-error')
  const logoutBtn = document.getElementById('logout-btn')
  const newEntryBtn = document.getElementById('new-entry-btn')
  const tbody = document.getElementById('guests-tbody')
  const emptyState = document.getElementById('empty-state')
  const searchInput = document.getElementById('search-input')
  const platformFilter = document.getElementById('platform-filter')

  const drawerOverlay = document.getElementById('drawer-overlay')
  const drawer = document.getElementById('drawer')
  const drawerTitle = document.getElementById('drawer-title')
  const drawerClose = document.getElementById('drawer-close')
  const deleteEntryBtn = document.getElementById('delete-entry-btn')
  const entryForm = document.getElementById('entry-form')
  const checkInInput = entryForm.querySelector('[name="checkIn"]')
  const checkOutInput = entryForm.querySelector('[name="checkOut"]')
  const nightsInput = entryForm.querySelector('[name="nights"]')

  const statGuests = document.getElementById('stat-guests')
  const statRating = document.getElementById('stat-rating')
  const statNights = document.getElementById('stat-nights')
  const statRevenue = document.getElementById('stat-revenue')

  let entries = []
  let sortKey = 'checkIn'
  let sortDir = 'desc'
  let currentEditId = null

  function showApp() {
    loginScreen.style.display = 'none'
    appScreen.style.display = 'block'
    loadEntries()
  }

  function showLogin() {
    appScreen.style.display = 'none'
    loginScreen.style.display = 'flex'
  }

  async function checkSession() {
    const res = await fetch(API, { method: 'GET' })
    if (res.ok) {
      const data = await res.json()
      entries = data.entries || []
      showApp()
      render()
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

  function openDrawer(entry) {
    entryForm.reset()
    if (entry) {
      currentEditId = entry.id
      drawerTitle.textContent = entry.name || 'Edit Guest'
      entryForm.elements['id'].value = entry.id
      for (const [key, value] of Object.entries(entry)) {
        const field = entryForm.elements[key]
        if (field) field.value = value ?? ''
      }
      deleteEntryBtn.style.display = 'inline-flex'
    } else {
      currentEditId = null
      drawerTitle.textContent = 'Add Guest'
      entryForm.elements['id'].value = ''
      deleteEntryBtn.style.display = 'none'
    }
    drawerOverlay.classList.add('open')
    drawer.classList.add('open')
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('open')
    drawer.classList.remove('open')
    entryForm.reset()
    currentEditId = null
  }

  newEntryBtn.addEventListener('click', () => openDrawer(null))
  drawerClose.addEventListener('click', closeDrawer)
  drawerOverlay.addEventListener('click', closeDrawer)

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
      closeDrawer()
      loadEntries()
    }
  })

  deleteEntryBtn.addEventListener('click', async () => {
    if (!currentEditId) return
    if (!confirm('Delete this guest?')) return
    const res = await fetch(API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentEditId })
    })
    if (res.ok) {
      closeDrawer()
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
    render()
  }

  function escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str ?? ''
    return div.innerHTML
  }

  function initials(name) {
    if (!name) return '?'
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('')
  }

  function parseMoney(val) {
    if (!val) return 0
    const n = parseFloat(String(val).replace(/[^0-9.-]/g, ''))
    return isNaN(n) ? 0 : n
  }

  function formatMoney(n) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }

  function platformClass(platform) {
    const p = (platform || '').toLowerCase()
    if (p === 'airbnb') return 'airbnb'
    if (p === 'vrbo') return 'vrbo'
    if (p === 'direct') return 'direct'
    return 'other'
  }

  function updateStats(list) {
    statGuests.textContent = list.length

    const rated = list.filter((e) => Number(e.rating))
    const avgRating = rated.length
      ? (rated.reduce((sum, e) => sum + Number(e.rating), 0) / rated.length).toFixed(1)
      : '—'
    statRating.textContent = rated.length ? `${avgRating} ★` : '—'

    const totalNights = list.reduce((sum, e) => sum + (Number(e.nights) || 0), 0)
    statNights.textContent = totalNights

    const totalRevenue = list.reduce((sum, e) => sum + parseMoney(e.payout), 0)
    statRevenue.textContent = formatMoney(totalRevenue)
  }

  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase()
    const platform = platformFilter.value

    return entries.filter((e) => {
      if (platform && e.platform !== platform) return false
      if (q) {
        const haystack = `${e.name || ''} ${e.phone || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }

  function sortEntries(list) {
    const sorted = [...list].sort((a, b) => {
      let av = a[sortKey] ?? ''
      let bv = b[sortKey] ?? ''
      if (sortKey === 'rating' || sortKey === 'payout') {
        av = sortKey === 'payout' ? parseMoney(av) : Number(av) || 0
        bv = sortKey === 'payout' ? parseMoney(bv) : Number(bv) || 0
      } else {
        av = String(av).toLowerCase()
        bv = String(bv).toLowerCase()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }

  document.querySelectorAll('thead th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey = key
        sortDir = 'asc'
      }
      render()
    })
  })

  searchInput.addEventListener('input', render)
  platformFilter.addEventListener('change', render)

  function render() {
    const filtered = getFiltered()
    updateStats(filtered)

    document.querySelectorAll('thead th[data-sort]').forEach((th) => {
      th.classList.toggle('sorted', th.dataset.sort === sortKey)
      const arrow = th.querySelector('.sort-arrow')
      if (th.dataset.sort === sortKey) {
        arrow.textContent = sortDir === 'asc' ? '▴' : '▾'
      } else {
        arrow.textContent = '▾'
      }
    })

    const sorted = sortEntries(filtered)
    tbody.innerHTML = ''
    emptyState.style.display = sorted.length ? 'none' : 'block'

    sorted.forEach((entry) => {
      const tr = document.createElement('tr')
      const rating = Number(entry.rating) || 0
      const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : ''
      const dateRange = [entry.checkIn, entry.checkOut].filter(Boolean).join(' → ')

      tr.innerHTML = `
        <td>
          <div class="guest-cell">
            <div class="avatar">${escapeHtml(initials(entry.name))}</div>
            <div>
              <div class="guest-name">${escapeHtml(entry.name) || 'Unnamed Guest'}</div>
              ${entry.phone ? `<div class="guest-name-sub">${escapeHtml(entry.phone)}</div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <div>${escapeHtml(dateRange) || '<span class="muted">—</span>'}</div>
          ${entry.nights ? `<div class="guest-name-sub">${escapeHtml(entry.nights)} nights</div>` : ''}
        </td>
        <td>${entry.platform ? `<span class="pill ${platformClass(entry.platform)}">${escapeHtml(entry.platform)}</span>` : '<span class="muted">—</span>'}</td>
        <td>${stars ? `<span class="stars">${stars}</span>` : '<span class="muted">—</span>'}</td>
        <td>${entry.payout ? escapeHtml(entry.payout) : '<span class="muted">—</span>'}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="icon-btn" data-action="edit" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button type="button" class="icon-btn danger" data-action="delete" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      `

      tr.addEventListener('click', () => openDrawer(entry))
      tr.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation()
        openDrawer(entry)
      })
      tr.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
        e.stopPropagation()
        if (!confirm('Delete this guest?')) return
        const res = await fetch(API, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: entry.id })
        })
        if (res.ok) loadEntries()
      })

      tbody.appendChild(tr)
    })
  }

  checkSession()
})()
