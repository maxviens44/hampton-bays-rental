// Static calendar data — prices and booked dates visible to all visitors.
// Update this file and push to GitHub to change what guests see.
// Admin localStorage changes override these defaults for the owner's session only.

(function () {
  const prices = {};
  const booked = [];

  // Helper to fill a range with a price
  function fill(from, to, price) {
    const d = new Date(from);
    const end = new Date(to);
    while (d <= end) {
      const key =
        d.getFullYear() +
        '-' + String(d.getMonth() + 1).padStart(2, '0') +
        '-' + String(d.getDate()).padStart(2, '0');
      prices[key] = price;
      d.setDate(d.getDate() + 1);
    }
  }

  // Peak summer 2026: $1,520/night
  fill('2026-06-01', '2026-08-31', 1520);

  // Labor Day weekend 2026 (Fri Sep 4 – Mon Sep 7): $1,500/night
  fill('2026-09-04', '2026-09-07', 1500);

  // --- BOOKED DATES ---
  // Add date strings like '2026-07-04' to mark as reserved.
  // Example: booked.push('2026-07-10', '2026-07-11');

  window.CALENDAR_DATA = { prices, booked };
})();
