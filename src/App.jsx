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

/* View-only Availability Calendar */
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
        if (!cancelled) setBooked(new Set())
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
    const total = daysInMonth(year, month)
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(d)

    return (
      <div className="rounded-xl border bg-white p-3 sm:p-4 shadow-sm">
        <h4 className="font-medium text-sm sm:text-base mb-2">{name}</h4>
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
              <div key={iso} className={`${base} ${stateCls} ${pastCls}`}>
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
    <section className="mt-8 sm:mt-10">
      <h3 className="text-base sm:text-lg font-semibold mb-3">Availability</h3>
      {!loaded && <div className="text-sm text-neutral-500 mb-2">Loading calendar…</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {monthsList.map(({ year, month, key }) => (
          <Month key={key} year={year} month={month} />
        ))}
      </div>
    </section>
  )
}

/* Home Sections (Hero, About, Gallery, Contact) */
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
      <section>
        <div className="relative">
          <img src="/images/hosue.webp" alt="House View" className="w-full h-[42vh] sm:h-[56vh] object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white text-xl sm:text-4xl font-semibold drop-shadow">Luxury Hamptons Retreat</h2>
            <p className="text-white text-xs sm:text-lg drop-shadow mt-1">10 guests · 4 bedrooms · 5 beds · 5 baths</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-4 py-8 border-t">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">About</h3>
        <p>Welcome to your Hamptons getaway. A cedar shingle home with heated saltwater pool and bay views.</p>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-4 py-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <button key={img.file} onClick={() => openAt(idx)} className="group relative">
              <img src={`/images/${img.file}`} alt={img.label} className="w-full h-40 object-cover rounded" />
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">{img.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={close}>
          <img src={`/images/${images[index].file}`} alt={images[index].label} className="max-h-[80vh]" />
        </div>
      )}
    </>
  )
}

/* Contact Form */
function ContactSection() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const days = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }, [checkIn, checkOut])

  return (
    <section id="contact" className="px-4 py-8 border-t">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">Contact</h3>
      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks.html" className="space-y-3">
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="Nights" value={nights} />

        <input name="First Name" placeholder="First Name" required className="border rounded px-3 py-2 w-full" />
        <input name="Last Name" placeholder="Last Name" required className="border rounded px-3 py-2 w-full" />
        <input type="email" name="Email" placeholder="Email" required className="border rounded px-3 py-2 w-full" />

        <div className="grid grid-cols-3 gap-2">
          <input type="date" name="Check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className="border rounded px-3 py-2" />
          <input type="date" name="Check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className="border rounded px-3 py-2" />
          <input type="number" value={nights} readOnly className="border rounded px-3 py-2 bg-gray-100" />
        </div>

        <button type="submit" className="rounded border px-5 py-2 hover:bg-black hover:text-white">Submit Inquiry</button>
      </form>
      <AvailabilityCalendar months={12} />
    </section>
  )
}

/* Info page */
function InfoPage() {
  return (
    <section className="px-4 py-10">
      <h2 className="text-xl font-semibold mb-3">Local Information</h2>
      <p>Beaches, restaurants, and house details coming soon.</p>
    </section>
  )
}

/* Reviews page */
function ReviewsPage() {
  return (
    <section className="px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">Share Your Stay</h2>
      <form name="review-pending" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thanks.html" className="space-y-3">
        <input type="hidden" name="form-name" value="review-pending" />
        <input name="Name" placeholder="Your Name" required className="border rounded px-3 py-2 w-full" />
        <select name="Stars" required className="border rounded px-3 py-2 w-full" defaultValue="">
          <option value="" disabled>Rating (1–5 stars)</option>
          <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
        </select>
        <input type="date" name="Stayed From" required className="border rounded px-3 py-2 w-full" />
        <input type="date" name="Stayed To" required className="border rounded px-3 py-2 w-full" />
        <textarea name="Comment" placeholder="Tell us about your stay…" required className="border rounded px-3 py-2 w-full" />
        <button type="submit" className="rounded border px-5 py-2 hover:bg-black hover:text-white">Submit Review</button>
      </form>
    </section>
  )
}

/* App Router */
export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#/")
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/")
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const isInfo = route.startsWith("#/info")
  const isReviews = route.startsWith("#/reviews")

  return (
    <main>
      <Header />
      {isInfo ? <InfoPage /> : isReviews ? <ReviewsPage /> : <HomeSections />}
      <footer className="px-4 py-8 border-t text-sm text-neutral-600">© {new Date().getFullYear()} Hamptons Rental</footer>
    </main>
  )
}
