#!/usr/bin/env node
// Usage: node add-booked-dates.js 2026-08-02 2026-08-08
// Appends every date in the given range to public/availability.json without removing existing dates.

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'public/availability.json');

const [,, from, to] = process.argv;
if (!from || !to) {
  console.error('Usage: node add-booked-dates.js YYYY-MM-DD YYYY-MM-DD');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const existing = new Set(data.booked);

const d = new Date(from + 'T12:00:00Z');
const end = new Date(to + 'T12:00:00Z');
const added = [];

while (d <= end) {
  const key = d.toISOString().slice(0, 10);
  if (!existing.has(key)) {
    existing.add(key);
    added.push(key);
  }
  d.setUTCDate(d.getUTCDate() + 1);
}

data.booked = [...existing].sort();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

if (added.length) {
  console.log(`Added ${added.length} date(s): ${added[0]} → ${added[added.length - 1]}`);
} else {
  console.log('No new dates added (all already present).');
}
