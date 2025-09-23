import React, { useEffect, useState, useCallback, useMemo } from "react"

/* ────────────────────────────────────────────────────────── *
 * Image list (keeps strict order in the grid)
 * ────────────────────────────────────────────────────────── */
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
    <header id="top" className="px-6 md:px-10 py-6 border-b sticky top-0 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl md:text-2xl font-semibold tracking-tight">
          2 Hubbard Street • Hampton Bays
        </a>
        <nav className="flex items-center gap-6 text-sm">
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

/* ────────────────────────────────────────────────────────── *
 * Availability Calendar (editable only when owner is logged in)
 * ────────────────────────────────────────────────────────── */
function AvailabilityCalendar({ months = 12, editable = false }) {
  const STORAGE_KEY = "hb_booked_dates_v1"

  const [booked, setBooked] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...booked]))
    } catch {}
  }, [booked])

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

  const toggleDate = (y, m, d) => {
    if (!editable) return
    const iso = toISO(y, m, d)
    setBooked((prev) => {
      const next = new Set(prev)
      if (next.has(iso)) next.delete(iso)
      else next.add(iso)
      return next
    })
  }

  const Month = ({ year, month }) => {
    const name = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })
    const firstDow = startOfMonthWeekday(year, month)
    const total = daysInMonth(year, month)
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(d)

    return (
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{name}</h4>
          {editable && <div className="text-xs text-neutral-500">Click to toggle</div>}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="py-1 text-neutral-600">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm">
          {cells.map((d, idx) => {
            if (d === null) return <div key={`b-${idx}`} />
            const iso = toISO(year, month, d)
            const bookedDay = booked.has(iso)
            const past = isPast(year, month, d)
            const base = "aspect-square flex items-center justify-center rounded-md border transition select-none"
            const bookedCls = bookedDay ? "bg-neutral-200 line-through text-neutral-500" : "bg-white hover:bg-neutral-50"
            const pastCls = past ? "opacity-40 cursor-not-allowed" : editable ? "cursor-pointer" : "cursor-default"
            return (
              <button
                key={iso}
                type="button"
                disabled={past || !editable}
                onClick={() => toggleDate(year, month, d)}
                className={`${base} ${bookedCls} ${pastCls}`}
                aria-pressed={bookedDay}
                aria-label={`${name} ${d}${bookedDay ? " (booked)" : ""}`}
                title={bookedDay ? "Booked" : "Available"}
              >
                {d}
              </button>
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
    <section className="mt-10" aria-labelledby="availability-title">
      <div className="flex items-center justify-between mb-3">
        <h3 id="availability-title" className="text-lg font-semibold">Availability</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-white" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-neutral-200" /> Booked
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {monthsList.map(({ year, month, key }) => (
          <Month key={key} year={year} month={month} />
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Netlify Identity helper (checks if current user is the owner)
 * ────────────────────────────────────────────────────────── */
function useOwnerIdentity() {
  const [isOwner, setIsOwner] = useState(false)
  const ownerEmail = (import.meta.env.VITE_OWNER_EMAIL || "").trim()

  useEffect(() => {
    const id = window.netlifyIdentity
    if (!id) {
      setIsOwner(false)
      return
    }

    const checkOwner = (user) => {
      const email = user?.email?.toLowerCase?.() || ""
      const ok = !!user && !!ownerEmail && email === ownerEmail.toLowerCase()
      setIsOwner(ok)
    }

    id.on("init", checkOwner)
    id.on("login", (user) => { checkOwner(user); id.close?.() })
    id.on("logout", () => setIsOwner(false))
    id.init()

    return () => {
      try { id.off("init"); id.off("login"); id.off("logout") } catch {}
    }
  }, [ownerEmail])

  const login = () => window.netlifyIdentity?.open("login")
  const logout = () => window.netlifyIdentity?.logout()

  return { isOwner, login, logout }
}

/* ────────────────────────────────────────────────────────── *
 * Home (hero, about, gallery, contact+calendar)
 * ────────────────────────────────────────────────────────── */
function HomeSections() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i) => { setIndex(i); setLightboxOpen(true) }, [])
  theclose: null
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
              className="w-full h-[46vh] md:h-[62vh] object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <h2 className="text-white text-2xl md:text-4xl font-semibold drop-shadow">
                Luxury Hamptons Retreat
              </h2>
              <p className="text-white text-sm md:text-lg drop-shadow">
                10 guests · 4 bedrooms · 5 beds · 5 baths
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 md:px-10 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">About</h3>
          <div className="space-y-4 text-neutral-800">
            <p>
              Welcome to your Hamptons getaway. A classic cedar shingle home that captures the timeless Hamptons style of luxury living. Located in Hampton Bays with bay views, this spacious retreat features a heated saltwater in-ground pool and easy access to beaches, restaurants, and shops. With 3,750 sq ft of space, the home comfortably sleeps up to 10 guests across 4 bedrooms and 5 bathrooms, blending elegance with modern convenience.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Livingroom with vaulted ceilings, oak floors, and a fireplace that opens to the patio and pool.</li>
              <li>Chef's kitchen with Viking appliances, Quartzite counters, and island seating.</li>
              <li>Main level includes two oversized en-suite bedrooms with direct patio access.</li>
              <li>The entire north wing of the second floor is devoted to the primary suite, complete with dual walk-in closets, a serene spa bath featuring a walk-in shower and freestanding jacuzzi tub, and a private balcony where you can take in the tranquil bay views.</li>
              <li>Fully finished walk-out lower level with 9 ft ceilings, media room, full bath, and laundry.</li>
              <li>Central air, outdoor shower, and workout room.</li>
            </ul>
            <p>
              Ideal for families, couples, or small groups, the home balances open gathering areas with private bedroom suites. Spend your days at the beach or lounging by the saltwater pool, then unwind by the fire after dinner in town. For those who need to stay connected, the property also features a dedicated home office with natural light and fast Wi-Fi for remote work.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery (keeps strict order via grid-flow-row) */}
      <section id="gallery" className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Gallery</h3>
        <p className="text-sm text-neutral-600 mb-6">Click any photo to view it full screen</p>
          <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {images.map((img, idx) => (
              <button
                key={img.file}
                onClick={() => openAt(idx)}
                className="group relative focus:outline-none"
                aria-label={`Open ${img.label}`}
              >
                <img
                  src={`/images/${img.file}`}
                  alt={img.label}
                  loading={idx < 6 ? "eager" : "lazy"}
                  className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-sm transform transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Calendar */}
      <ContactSection />

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 md:p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/images/${images[index].file}`}
              alt={images[index].label}
              className="w-full h-[70vh] md:h-[82vh] object-contain rounded-lg"
            />
            <div className="absolute inset-x-0 -bottom-12 md:bottom-auto md:top-3 flex justify-center md:justify-end gap-2">
              <button onClick={prev} type="button" className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow">Prev</button>
              <button onClick={next} type="button" className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow">Next</button>
              <button onClick={close} type="button" className="rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* Admin/Login bar + Contact + Calendar (Check-in/Check-out + Nights) */
function ContactSection() {
  const { isOwner, login, logout } = useOwnerIdentity()
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
    <section id="contact" className="px-6 md:px-10 py-8 md:py-12 border-t">
      <div className="max-w-3xl mx-auto">
        {/* Owner toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold">Contact</h3>
          <div className="flex items-center gap-2 text-xs">
            {window.netlifyIdentity ? (
              isOwner ? (
                <>
                  <span className="rounded-full border px-2 py-1 bg-black text-white">Owner Mode</span>
                  <button onClick={logout} className="rounded-full border px-3 py-1 hover:bg-black hover:text-white transition">Log out</button>
                </>
              ) : (
                <button onClick={login} className="rounded-full border px-3 py-1 hover:bg-black hover:text-white transition">Owner log in</button>
              )
            ) : (
              <span className="text-neutral-500">Identity not loaded</span>
            )}
          </div>
        </div>

        <p className="text-neutral-700 mb-6">For availability and rates, submit the form below</p>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thanks.html"
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="Calculated Nights" value={nights} />
          <p className="hidden">
            <label>Don’t fill this out if you’re human <input name="bot-field" /></label>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="First Name" placeholder="First Name" required className="border rounded-lg px-3 py-2 w-full" />
            <input type="text" name="Last Name" placeholder="Last Name" required className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" name="Email
