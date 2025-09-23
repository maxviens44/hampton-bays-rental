import React, { useEffect, useState, useCallback, useMemo } from "react"

/* Images shown in the Gallery */
const images = [
  { file: "top.webp", label: "Aerial View" },
  { file: "hosue.webp", label: "Exterior Front" },
  { file: "living.webp", label: "Living Room" },
  { file: "living2.webp", label: "Living Room View" },
  { file: "living3.webp", label: "Living Room Detail" },
  { file: "kitchen1.webp", label: "Chef's Kitchen" },
  { file: "kitchen2.webp", label: "Chef's Kitchen" },
  { file: "kitchen3.webp", label: "Chef's Kitchen" },
  { file: "dining.webp", label: "Dining Area" },
  { file: "pool1.webp", label: "Saltwater Pool" },
  { file: "pool2.webp", label: "Pool and Patio" },
  { file: "pool3.webp", label: "Poolside" },
  { file: "pool4.webp", label: "Salt Water Pool" },
  { file: "primary.webp", label: "Primary Bedroom" },
  { file: "primary2.webp", label: "Primary Suite" },
  { file: "primarydoors.webp", label: "Primary Doors to Balcony" },
  { file: "balcony.webp", label: "Balcony View" },
  { file: "bathmain.webp", label: "Main Bath" },
  { file: "bathmain2.webp", label: "Primary Suite Bathroom" },
  { file: "bathmain3.webp", label: "Luxury Bath" },
  { file: "room1.webp", label: "Bedroom 2" },
  { file: "bath1.webp", label: "Guest Bath" },
  { file: "room2.webp", label: "Bedroom 3" },
  { file: "bath4.webp", label: "Full Bathroom" },
  { file: "room4.webp", label: "Bedroom 4" },
  { file: "basement1.webp", label: "Finished Basement" },
  { file: "basement2.webp", label: "Basement Lounge" },
  { file: "bath2.webp", label: "Bathroom" },
  { file: "room-office2.webp", label: "Home Office" },
  { file: "foyer.webp", label: "Front Foyer" },
  { file: "foyer2.webp", label: "Entryway" },
  { file: "garage.webp", label: "Detached Garage" },
  { file: "laundry.webp", label: "Laundry Room" },
  { file: "restroom.webp", label: "Half Bath" },
  { file: "stairs.webp", label: "Staircase" }
]

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-base sm:text-xl font-semibold tracking-tight">
          2 Hubbard Street • Hampton Bays
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#about" className="hover:underline">About</a>
          <a href="#gallery" className="hover:underline">Gallery</a>
          <a href="#/info" className="hover:underline">Info</a>
          <a href="#/reviews" className="hover:underline">Reviews</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  )
}

/* View-only Availability, fed by /availability.json */
function AvailabilityCalendar({ months = 12 }) {
  const [booked, setBooked] = useState(() => new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/availability.json?v=${Date.now()}`)
        if (!res.ok) throw new Error("Failed to load availability.json")
        const data = await res.json()
        const dates = Array.isArray(data?.booked) ? data.booked : []
        if (!cancelled) setBooked(new Set(dates))
      } catch {
        if (!cancelled) setBooked(new Set()) // default = all available
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const today = new Date()
  const startYear = today.getFullYear()
  const startMonth = today.getMonth()
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const startOfMonthWeekday = (y, m) => new Date(y, m, 1).getDay()
  const isPast = (y, m, d) => {
    const date = new Date(y, m, d, 23, 59, 59, 999)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  const Month = ({ year, month }) => {
    const name = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })
    const firstDow = startOfMonthWeekday(year, month)
    aconst total = daysInMonth(year, month)
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(d)

    return (
      <div className="rounded-xl border bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm sm:text-base">{name}</h4>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="py-1 text-neutral-600">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
          {cells.map((d, idx) => {
            if (d === null) return <div key={`b-${idx}`} />
            const iso = toISO(year, month, d)
            const isBooked = booked.has(iso)
            const past = isPast(year, month, d)
            const base = "aspect-square flex items-center justify-center rounded-md border select-none"
            const stateCls = isBooked ? "bg-neutral-200 line-through text-neutral-500" : "bg-white"
            const pastCls = past ? "opacity-40" : ""
            return (
              <div
                key={iso}
                className={`${base} ${stateCls} ${pastCls}`}
                aria-label={`${name} ${d}${isBooked ? " (booked)" : ""}`}
                title={isBooked ? "Booked" : "Available"}
              >
                {d}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const monthsList = Array.from({ length: months }, (_, i) => {
    const m = startMonth + i
    const y = startYear + Math.floor(m / 12)
    const mm = m % 12
    return { year: y, month: mm, key: `${y}-${mm}` }
  })

  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="availability-title">
      <div className="flex items-center justify-between mb-3 px-4 sm:px-0">
        <h3 id="availability-title" className="text-base sm:text-lg font-semibold">Availability</h3>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-white" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-neutral-200" /> Booked
          </span>
        </div>
      </div>

      {!loaded && <div className="text-sm text-neutral-500 mb-2 px-4 sm:px-0">Loading calendar…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-0">
        {monthsList.map(({ year, month, key }) => (
          <Month key={key} year={year} month={month} />
        ))}
      </div>
    </section>
  )
}

/* Home sections + mobile-friendly Lightbox */
function HomeSections() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i) => { setIndex(i); setLightboxOpen(true) }, [])
  const close = useCallback(() => setLightboxOpen(false), [])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightboxOpen, close, next, prev])

  return (
    <>
      {/* Hero */}
      <section className="px-0 py-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <img
              src="/images/hosue.webp"
              alt="House View"
              className="w-full h-[42vh] sm:h-[56vh] object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
              <h2 className="text-white text-xl sm:text-4xl font-semibold drop-shadow">
                Luxury Hamptons Retreat
              </h2>
              <p className="text-white text-xs sm:text-lg drop-shadow mt-1 sm:mt-2">
                10 guests · 4 bedrooms · 5 beds · 5 baths
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-4 sm:px-6 md:px-10 py-8 sm:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">About</h3>
          <div className="space-y-4 text-neutral-800 text-sm sm:text-base">
            <p>
              Welcome to your Hamptons getaway. A classic cedar shingle home that captures the timeless Hamptons style of luxury living. Located in Hampton Bays with bay views, this spacious retreat features a heated saltwater in-ground pool and easy access to beaches, restaurants, and shops.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vaulted living room opening to the patio and pool</li>
              <li>Chef’s kitchen with Viking appliances and island seating</li>
              <li>Two oversized en-suite bedrooms on the main level</li>
              <li>Primary suite upstairs with balcony and spa bath</li>
              <li>Finished lower level with media room, full bath, laundry</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-4 sm:px-6 md:px-10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Gallery</h3>
          <p className="text-xs sm:text-sm text-neutral-600 mb-4 sm:mb-6">
            Tap any photo to view it full screen
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {images.map((img, idx) => (
              <button
                key={img.file}
                type="button"
                onClick={() => openAt(idx)}
                className="group relative focus:outline-none"
                aria-label={`Open ${img.label}`}
              >
                <img
                  src={`/images/${img.file}`}
                  alt={img.label}
                  loading={idx < 6 ? "eager" : "lazy"}
                  className="w-full h-40 sm:h-56 object-cover rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-[10px] sm:text-xs bg-black/50 text-white px-1.5 py-0.5 sm:px-2 rounded">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Calendar */}
      <ContactSection />

      {/* Lightbox (mobile touch friendly) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/images/${images[index].file}`}
              alt={images[index].label}
              className="w-full h-[70vh] sm:h-[82vh] object-contain rounded-lg"
            />
            <div className="absolute inset-x-0 -bottom-12 sm:bottom-auto sm:top-3 flex justify-center sm:justify-end gap-2">
              <button
                onClick={prev}
                type="button"
                className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
                aria-label="Previous"
              >
                Prev
              </button>
              <button
                onClick={next}
                type="button"
                className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
                aria-label="Next"
              >
                Next
              </button>
              <button
                onClick={close}
                type="button"
                className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* Contact + Calendar (with Check-in/Check-out) */
function ContactSection() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const ms = d2 - d1
    const days = Math.round(ms / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }, [checkIn, checkOut])
  const todayIso = new Date().toISOString().slice(0, 10)
  const validDates = !checkIn || !checkOut ? true : nights > 0

  return (
    <section id="contact" className="px-4 sm:px-6 md:px-10 py-8 sm:py-12 border-t">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact</h3>
        <p className="text-neutral-700 mb-4 sm:mb-6 text-sm sm:text-base">
          For availability and rates, submit the form below
        </p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thanks.html"
          className="space-y-3 sm:space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>Don’t fill this out if you’re human <input name="bot-field" /></label>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input type="text" name="First Name" placeholder="First Name" required className="border rounded-lg px-3 py-2 w-full" />
            <input type="text" name="Last Name" placeholder="Last Name" required className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div
