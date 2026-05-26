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

  // Base summer 2026: $1,300/night
  fill('2026-06-01', '2026-08-31', 1300);

  // June custom pricing
  fill('2026-06-14', '2026-06-14', 1250);
  fill('2026-06-16', '2026-06-16', 1250);
  fill('2026-06-17', '2026-06-17', 1500);
  fill('2026-06-18', '2026-06-21', 2500);

  // July 5–24: $1,500/night
  fill('2026-07-05', '2026-07-24', 1500);

  // Aug 16–31: $1,500/night
  fill('2026-08-16', '2026-08-31', 1500);

  // Labor Day weekend 2026 (Fri Sep 4 – Mon Sep 7): $1,500/night
  fill('2026-09-04', '2026-09-07', 1500);

  // --- BOOKED DATES ---
  // Add date strings like '2026-07-04' to mark as reserved.
  // Example: booked.push('2026-07-10', '2026-07-11');

  window.CALENDAR_DATA = { prices, booked };
})();
