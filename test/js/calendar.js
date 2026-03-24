// ── CALENDAR DATA (stored in localStorage for admin persistence) ──
const STORAGE_KEY = 'sth_calendar_data';

function getCalendarData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { prices: {}, booked: [] };
  } catch { return { prices: {}, booked: [] }; }
}

function saveCalendarData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function dateKey(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function isBooked(key, data) {
  return data.booked.includes(key);
}

function getPrice(key, data) {
  return data.prices[key] || null;
}

// ── RENDER CALENDAR ──
function renderCalendar(containerId, isAdmin = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const data = getCalendarData();
  const today = new Date();
  const months = [];
  for (let i = 0; i < (isAdmin ? 3 : 2); i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  let html = `<div class="cal-wrapper">`;

  months.forEach(({ year, month }) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    html += `<div class="cal-month">
      <div class="cal-month-header">
        <span class="cal-month-name">${monthNames[month]}</span>
        <span class="cal-month-year">${year}</span>
      </div>
      <div class="cal-grid">`;

    dayLabels.forEach(d => {
      html += `<div class="cal-day-label">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(year, month, d);
      const booked = isBooked(key, data);
      const price = getPrice(key, data);
      const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const cls = [
        'cal-day',
        booked ? 'booked' : '',
        isPast ? 'past' : '',
        price && !booked && !isPast ? 'has-price' : ''
      ].filter(Boolean).join(' ');

      const tooltip = booked ? 'Reserved' : (price ? `$${price}/night` : '');
      const dataAttrs = `data-key="${key}" data-price="${price || ''}" data-booked="${booked}"`;

      html += `<div class="${cls}" ${dataAttrs} title="${tooltip}">
        <span class="cal-day-num">${d}</span>
        ${price && !booked && !isPast ? `<span class="cal-day-price">$${price}</span>` : ''}
        ${booked ? '<span class="cal-booked-dot"></span>' : ''}
      </div>`;
    }

    html += `</div></div>`;
  });

  html += `</div>`;

  // Legend
  html += `<div class="cal-legend">
    <div class="cal-legend-item"><span class="cal-legend-dot available"></span> Available</div>
    <div class="cal-legend-item"><span class="cal-legend-dot priced"></span> Priced</div>
    <div class="cal-legend-item"><span class="cal-legend-dot booked-dot"></span> Reserved</div>
    <div class="cal-legend-item"><span class="cal-legend-dot past-dot"></span> Past</div>
  </div>`;

  container.innerHTML = html;

  // Hover tooltip
  container.querySelectorAll('.cal-day[data-key]').forEach(el => {
    el.addEventListener('mouseenter', e => {
      const price = el.dataset.price;
      const booked = el.dataset.booked === 'true';
      if (!price && !booked) return;
      showTooltip(el, booked ? 'Reserved' : `$${price}/night`);
    });
    el.addEventListener('mouseleave', hideTooltip);
  });

  // Admin click to edit
  if (isAdmin) {
    container.querySelectorAll('.cal-day:not(.past):not(.empty)').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => openAdminModal(el.dataset.key, data));
    });
  }
}

// ── TOOLTIP ──
let tooltipEl = null;
function showTooltip(anchor, text) {
  hideTooltip();
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'cal-tooltip';
  tooltipEl.textContent = text;
  document.body.appendChild(tooltipEl);
  const rect = anchor.getBoundingClientRect();
  tooltipEl.style.left = (rect.left + rect.width/2 - tooltipEl.offsetWidth/2 + window.scrollX) + 'px';
  tooltipEl.style.top = (rect.top - 36 + window.scrollY) + 'px';
}
function hideTooltip() {
  if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
}

// ── ADMIN MODAL ──
function openAdminModal(key, data) {
  const booked = isBooked(key, data);
  const price = getPrice(key, data) || '';

  const modal = document.createElement('div');
  modal.className = 'cal-modal-overlay';
  modal.innerHTML = `
    <div class="cal-modal">
      <div class="cal-modal-header">
        <h3>Edit Date</h3>
        <span class="cal-modal-date">${key}</span>
      </div>
      <div class="cal-modal-body">
        <label class="cal-modal-label">Nightly Rate ($)
          <input type="number" class="cal-modal-input" id="modal-price" value="${price}" placeholder="e.g. 850" min="0" />
        </label>
        <label class="cal-modal-check">
          <input type="checkbox" id="modal-booked" ${booked ? 'checked' : ''} />
          <span>Mark as Reserved (greyed out)</span>
        </label>
      </div>
      <div class="cal-modal-actions">
        <button class="btn-gold" id="modal-save">Save</button>
        <button class="btn-gold" id="modal-clear" style="border-color:var(--text-dim);color:var(--text-dim)">Clear</button>
        <button class="btn-gold" id="modal-cancel" style="border-color:var(--text-dim);color:var(--text-dim)">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#modal-save').addEventListener('click', () => {
    const newPrice = modal.querySelector('#modal-price').value;
    const newBooked = modal.querySelector('#modal-booked').checked;
    const fresh = getCalendarData();
    if (newPrice) fresh.prices[key] = parseInt(newPrice);
    else delete fresh.prices[key];
    if (newBooked) { if (!fresh.booked.includes(key)) fresh.booked.push(key); }
    else fresh.booked = fresh.booked.filter(k => k !== key);
    saveCalendarData(fresh);
    modal.remove();
    // Re-render
    const adminEl = document.getElementById('admin-calendar');
    const homeEl = document.getElementById('availability-calendar');
    if (adminEl) renderCalendar('admin-calendar', true);
    if (homeEl) renderCalendar('availability-calendar', false);
  });

  modal.querySelector('#modal-clear').addEventListener('click', () => {
    const fresh = getCalendarData();
    delete fresh.prices[key];
    fresh.booked = fresh.booked.filter(k => k !== key);
    saveCalendarData(fresh);
    modal.remove();
    const adminEl = document.getElementById('admin-calendar');
    if (adminEl) renderCalendar('admin-calendar', true);
  });

  modal.querySelector('#modal-cancel').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
