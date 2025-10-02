import React, { useEffect, useState, useCallback, useMemo } from "react"

/* ────────────────────────────────────────────────────────── *
 * Image list (keeps strict order in the grid)
 * ────────────────────────────────────────────────────────── */
const images = [
  { file: "top.webp", label: "Aerial View" },
  { file: "house.webp", label: "Exterior Front" },
  { file: "map.png", label: "Location" },
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

/* ────────────────────────────────────────────────────────── *
 * Header with mobile dropdown menu under the sticky bar
 * ────────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false)

  // Keep page scrollable when menu is open
  useEffect(() => {
    document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const Link = ({ href, children, onClick, className = "" }) => (
    <a
      href={href}
      onClick={(e) => {
        setOpen(false)
        onClick?.(e)
      }}
      className={`hover:underline ${className}`}
    >
      {children}
    </a>
  )

  return (
    <header id="top" className="relative px-4 md:px-10 py-3 md:py-5 border-b sticky top-0 bg-white md:bg-white/90 backdrop-blur md:backdrop-blur z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <a href="/" className="text-base sm:text-lg md:text-2xl font-semibold tracking-tight">
          Hampton Bays
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="#about" className="px-2 py-1">About</Link>
          <Link href="#gallery" className="px-2 py-1">Gallery</Link>
          <Link href="#/info" className="px-2 py-1">Info</Link>
          <Link href="#/reviews" className="px-2 py-1">Reviews</Link>
          <Link href="#/usopen" className="px-2 py-1">US Open 2026</Link>
          <Link href="#/contact" className="px-2 py-1">Contact</Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2 bg-white shadow-sm"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown, anchored to header, solid white */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-lg">
          <nav className="px-4 py-3 grid gap-1 text-base">
            <Link href="#about" className="px-2 py-2 rounded-lg hover:bg-neutral-100">About</Link>
            <Link href="#gallery" className="px-2 py-2 rounded-lg hover:bg-neutral-100">Gallery</Link>
            <Link href="#/info" className="px-2 py-2 rounded-lg hover:bg-neutral-100">Info</Link>
            <Link href="#/reviews" className="px-2 py-2 rounded-lg hover:bg-neutral-100">Reviews</Link>
            <Link href="#/usopen" className="px-2 py-2 rounded-lg hover:bg-neutral-100">US Open 2026</Link>
            <Link href="#/contact" className="px-2 py-2 rounded-lg hover:bg-neutral-100">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Availability Calendar with pricing hover
 * - availability.json: { "booked": ["YYYY-MM-DD", ...] }
 * - pricing.json: { "currency":"USD","default":1000,"prices":{ "YYYY-MM-DD":2400 } }
 * Fallback default if pricing.json missing: 1000 USD
 * ────────────────────────────────────────────────────────── */
function AvailabilityCalendar({ months = 12 }) {
  const [booked, setBooked] = useState(() => new Set())
  const [loaded, setLoaded] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const [defaultPrice, setDefaultPrice] = useState(1000)
  const [overrides, setOverrides] = useState({})
  const [tip, setTip] = useState({ open: false, text: "", x: 0, y: 0 })

  const hideTip = useCallback(() => {
    setTip(t => t.open ? { open: false, text: "", x: 0, y: 0 } : t)
  }, [])

  useEffect(() => {
    const hideOnScroll = () => hideTip()
    const onKey = e => { if (e.key === "Escape") hideTip() }
    const onTouchMove = () => hideTip()
    const onGlobalClick = e => {
      if (!(e.target.closest && e.target.closest(".cal-day"))) hideTip()
    }

    window.addEventListener("scroll", hideOnScroll, { passive: true })
    window.addEventListener("wheel", hideOnScroll, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("keydown", onKey)
    window.addEventListener("click", onGlobalClick, true)

    return () => {
      window.removeEventListener("scroll", hideOnScroll)
      window.removeEventListener("wheel", hideOnScroll)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("click", onGlobalClick, true)
    }
  }, [hideTip])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [availRes, priceRes] = await Promise.all([
          fetch(`/availability.json?v=${Date.now()}`),
          fetch(`/pricing.json?v=${Date.now()}`)
        ])
        if (!availRes.ok) throw new Error("availability.json failed")
        const a = await availRes.json()
        const dates = Array.isArray(a?.booked) ? a.booked : []
        if (!cancelled) setBooked(new Set(dates))

        if (priceRes.ok) {
          const p = await priceRes.json()
          const cur = typeof p?.currency === "string" ? p.currency : "USD"
          const def = typeof p?.default === "number" ? p.default : defaultPrice
          const map = p?.prices && typeof p.prices === "object" ? p.prices : {}
          if (!cancelled) {
            setCurrency(cur)
            setDefaultPrice(def)
            setOverrides(map)
          }
        }
      } catch {
        if (!cancelled) {
          setBooked(new Set())
          setCurrency("USD")
          setDefaultPrice(1000)
          setOverrides({})
        }
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const fmt = useMemo(() => {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency }) }
    catch { return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }) }
  }, [currency])

  const priceFor = useCallback((iso) => {
    const v = overrides?.[iso]
    if (typeof v === "number") return v
    return defaultPrice
  }, [overrides, defaultPrice])

  const showTip = useCallback((e, text) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTip({ open: true, text, x: r.left + r.width / 2, y: r.top - 8 })
  }, [])

  const today = new Date()
  const startYear = today.getFullYear()
  const startMonth = today.getMonth()
  const pad = n => (n < 10 ? `0${n}` : `${n}`)
  const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const startOfMonthWeekday = (y, m) => new Date(y, m, 1).getDay()
  const isPast = (y, m, d) => new Date(y, m, d, 23, 59, 59, 999) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const Month = ({ year, month }) => {
    const name = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })
    const firstDow = startOfMonthWeekday(year, month)
    const total = daysInMonth(year, month)
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(d)

    return (
      <div className="rounded-xl border bg-white p-2 shadow-sm text-sm">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm">{name}</h4>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="py-0.5 text-neutral-600">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-xs">
          {cells.map((d, idx) => {
            if (d === null) return <div key={`b-${idx}`} />
            const iso = toISO(year, month, d)
            const isBookedDay = booked.has(iso)
            const past = isPast(year, month, d)
            const price = priceFor(iso)

            const base = "cal-day w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded border text-xs select-none relative"
            const stateCls = isBookedDay ? "bg-neutral-200 line-through text-neutral-500 cursor-not-allowed" : "bg-white cursor-default"
            const pastCls = past ? "opacity-40" : ""
            const label = isBookedDay ? "Booked" : `Nightly price ${fmt.format(price)}`

            return (
              <div
                key={iso}
                className={`${base} ${stateCls} ${pastCls}`}
                onPointerEnter={(e) => { if (e.pointerType !== "touch") showTip(e, label) }}
                onPointerLeave={(e) => { if (e.pointerType !== "touch") hideTip() }}
                onPointerCancel={hideTip}
                onPointerDown={(e) => {
                  if (e.pointerType === "touch") {
                    showTip(e, label)
                    window.clearTimeout(window.__tipHideT)
                    window.__tipHideT = window.setTimeout(() => hideTip(), 2000)
                    e.preventDefault()
                    e.stopPropagation()
                  }
                }}
                title={label}
                aria-label={`${name} ${d}${isBookedDay ? " booked" : ` price ${fmt.format(price)}`}`}
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
    <section className="mt-8 md:mt-10" aria-labelledby="availability-title">
      <div className="flex items-center justify-between mb-2">
        <h3 id="availability-title" className="text-base md:text-lg font-semibold">Availability</h3>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm border bg-white" /> Available</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm border bg-neutral-200" /> Booked</span>
        </div>
      </div>
      {!loaded && <div className="text-xs text-neutral-500 mb-2">Loading calendar…</div>}
      <p className="text-[11px] text-neutral-500 mb-2">Hover a date or tap on mobile to see the nightly price or status</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3">
        {monthsList.map(({ year, month, key }) => (<Month key={key} year={year} month={month} />))}
      </div>
      {tip.open && (
        <div
          style={{ position: "fixed", left: tip.x, top: tip.y, transform: "translate(-50%, -100%)", pointerEvents: "none", zIndex: 9999 }}
          className="px-2 py-1 text-[11px] rounded bg-black text-white shadow"
          role="tooltip"
          aria-hidden={!tip.open}
        >
          {tip.text}
        </div>
      )}
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
              src="/images/house.webp"
              alt="House View"
              width="2400"
              height="1600"
className="w-full h-[44vh] sm:h-[50vh] md:h-[62vh] object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10">
              <h1 className="text-white text-xl sm:text-2xl md:text-4xl font-semibold drop-shadow">
                Luxury Hamptons Retreat
              </h1>
              <p className="text-white text-xs sm:text-sm md:text-lg drop-shadow mt-1">
                10 guests · 4 bedrooms · 5 beds · 5 baths
              </p>
              <p className="text-white text-[11px] sm:text-xs md:text-sm drop-shadow mt-1">
                Hamptons house rental in Hampton Bays near Shinnecock Hills, ideal for U.S. Open 2026 week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-4 md:px-10 py-8 md:py-12 border-t">
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
              <li>The entire north wing of the second floor is devoted to the primary suite, complete with dual walk-in closets, a spa bathroom featuring a walk-in shower, jacuzzi tub, and a private balcony where you can take in the tranquil bay views.</li>
              <li>Fully finished walk-out lower level with 9 ft ceilings, media room, full bath, and laundry.</li>
              <li>Central air, outdoor shower, and workout room.</li>
            </ul>
            <p>
              Ideal for families, couples, or small groups, the home balances open gathering areas with private bedroom suites. Spend your days at the beach or lounging by the saltwater pool, then unwind by the fire after dinner in town. For those who need to stay connected, the property also features a dedicated home office with natural light and fast Wi-Fi for remote work.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-4 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Gallery</h3>
          <p className="text-sm text-neutral-600 mb-6">Tap any photo to view it full screen</p>
          <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
                  className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-2xl shadow-sm transform transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 text-[11px] sm:text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Calendar */}
      <ContactSection />

      {/* Lightbox overlay */}
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
              <button onClick={prev} type="button" className="rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow">Prev</button>
              <button onClick={next} type="button" className="rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow">Next</button>
              <button onClick={close} type="button" className="rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Contact + compact calendar (Check-in/Check-out + hidden nights)
 * ────────────────────────────────────────────────────────── */
function ContactSection() {
  const { isOwner, login, logout } = useOwnerIdentity()

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diff = (d2 - d1) / (1000 * 60 * 60 * 24)
    return diff > 0 ? Math.round(diff) : 0
  }, [checkIn, checkOut])
  const todayIso = new Date().toISOString().slice(0, 10)
  const valid = !checkIn || !checkOut ? true : nights > 0

  return (
    <section id="contact" className="px-4 md:px-10 py-8 md:py-12 border-t">
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
            
            )=>
          
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
            <input type="text" name="First Name" placeholder="First Name" required className="border rounded-lg px-3 py-3 w-full" />
            <input type="text" name="Last Name" placeholder="Last Name" required className="border rounded-lg px-3 py-3 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" name="Email" placeholder="Email" required className="border rounded-lg px-3 py-3 w-full" />
            <input type="tel" name="Phone" placeholder="Phone" className="border rounded-lg px-3 py-3 w-full" />
          </div>

          {/* Check-in / Check-out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Check-in</label>
              <input
                type="date"
                name="Check-in"
                min={todayIso}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="border rounded-lg px-3 py-3 w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Check-out</label>
              <input
                type="date"
                name="Check-out"
                min={checkIn || todayIso}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="border rounded-lg px-3 py-3 w-full"
              />
            </div>
          </div>

          {!valid && (
            <div className="text-xs text-red-600">Check-out must be after Check-in.</div>
          )}

          <button
            type="submit"
            disabled={!valid}
            className="rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-black hover:text-white disabled:opacity-50 transition"
          >
            Submit Inquiry
          </button>
        </form>

        {/* Compact calendar under the form */}
        <AvailabilityCalendar months={12} />
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Info Page (deep-link sections)
 * ────────────────────────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
    >
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
    </svg>
  )
}

function Pill({ children, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-black hover:text-white transition"
    >
      {children}
    </a>
  )
}

function AccordionCard({ title, open, onClick, children }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-white">
      <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3">
        <span className="font-medium">{title}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm">
          {children}
        </div>
      )}
    </div>
  )
}

function InfoPage() {
  const origin = encodeURIComponent("2 Hubbard Street, Hampton Bays, NY 11946")
  const gmaps = (dest) =>
    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  const [open, setOpen] = useState({
    wifi: true,
    checkin: true,
    trash: false,
    lighting: false,
    outdoor: false,
    parking: false,
    office: false,
    emergency: false,
    rules: false
  })
  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }))

  const beaches = [
    { name: "Ponquogue Beach", desc: "Wide ocean beach with soft sand and seasonal facilities", info: "https://www.southamptontownny.gov/facilities/facility/details/Ponquogue-Beach-Pavilion-34", dest: "Ponquogue Beach, Dune Rd, Hampton Bays, NY" },
    { name: "Tiana Beach", desc: "Family friendly ocean spot with pavilion area and gentle surf", info: "https://www.southamptontownny.gov/facilities/facility/details/tianabeachandpavilion-36", dest: "Tiana Beach, Dune Rd, Hampton Bays, NY" },
    { name: "Meschutt Beach County Park", desc: "Bay beach with calmer water and easy food options", info: "https://suffolkcountyny.gov/Departments/Parks/Our-Parks/Meschutt-Beach-County-Park", dest: "Meschutt Beach County Park, Hampton Bays, NY" },
    { name: "Shinnecock East County Park", desc: "Natural oceanfront near the inlet with fewer structures", info: "https://www.suffolkcountyny.gov/Departments/Parks/Our-Parks/Shinnecock-East-County-Park", dest: "Shinnecock East County Park, Dune Rd, Southampton, NY" },
    { name: "Coopers Beach", desc: "Southampton flagship beach with services and long shoreline walks", info: "https://www.southamptonvillage.org/Facilities/Facility/Details/Coopers-Beach-6", dest: "Coopers Beach, 268 Meadow Ln, Southampton, NY 11968" },
    { name: "Old Town Beach", desc: "Quieter option south of the village with classic ocean views", info: "https://www.southamptontownny.gov/Facilities/Facility/Details/Old-Town-Beach-35", dest: "Old Town Beach, 159 Gin Ln, Southampton, NY 11968" },
    { name: "Flying Point Beach", desc: "Water Mill favorite with a broad beach face and relaxed feel", info: "https://www.southamptontownny.gov/1445/Flying-Point-Comfort-Station", dest: "Flying Point Beach, 1055 Flying Point Rd, Water Mill, NY 11976" },
    { name: "Foster Memorial Beach Long Beach", desc: "Sag Harbor bay beach with calm water and sunset views", info: "https://www.southamptontownny.gov/facilities/facility/details/Foster-Memorial-Beach-Long-Beach-31", dest: "Foster Memorial Beach, Long Beach Rd, Sag Harbor, NY 11963" },
    { name: "Havens Beach", desc: "Village bay beach close to town and convenient for families", info: "https://www.sagharborny.gov/parksrec/page/havens-beach", dest: "Havens Beach, Sag Harbor, NY" },
    { name: "Main Beach East Hampton", desc: "Iconic village ocean beach with lifeguards and dunes", info: "https://easthamptonvillage.org/394/Main-Beach", dest: "Main Beach, 104 Ocean Ave, East Hampton, NY 11937" },
    { name: "Two Mile Hollow Beach", desc: "Less crowded village beach with wide Atlantic shoreline", info: "https://easthamptonvillage.org/395/Two-Mile-Hollow-Beach", dest: "Two Mile Hollow Beach, East Hampton, NY 11937" },
    { name: "Georgica Beach", desc: "Beautiful stretch near Georgica Pond with a quieter vibe", info: "https://easthamptonvillage.org/396/Georgica-Beach", dest: "Georgica Beach, 219 Lily Pond Ln, East Hampton, NY 11937" },
    { name: "Indian Wells Beach", desc: "Amagansett favorite with long open beach and seasonal facilities", info: "https://www.easthamptonny.gov/Facilities/Facility/Details/Indian-Wells-Beach-19", dest: "Indian Wells Beach, Amagansett, NY 11930" }
  ]

  const restaurants = [
    { town: "Hampton Bays", name: "Rumba", url: "https://tasterumba.com/hampton-bays-ny/", desc: "Caribbean inspired spot on the water with fish tacos and rum drinks" },
    { town: "Hampton Bays", name: "Cowfish", url: "https://cowfishrestaurant.com/", desc: "Waterfront seafood, sushi, and steaks with canal views" },
    { town: "Hampton Bays", name: "Edgewater", url: "https://www.edgewaterrestaurant.com/", desc: "Classic Italian with seafood pastas and a family friendly vibe" },
    { town: "Hampton Bays", name: "Oakland’s", url: "https://oaklandsrestaurant.net/", desc: "Seasonal marina restaurant for seafood platters and sunsets" },
    { town: "Hampton Bays", name: "1 North Steakhouse", url: "https://www.1northsteakhouse.com/", desc: "Local steakhouse with hearty cuts and a busy bar scene" },

    { town: "Southampton", name: "75 Main", url: "https://75main.com/", desc: "Trendy American bistro with a Hamptons social vibe" },
    { town: "Southampton", name: "Sant Ambroeus", url: "https://www.santambroeus.com/pages/location-southampton", desc: "Chic Milan style cafe and upscale Italian classics" },
    { town: "Southampton", name: "Tutto Il Giorno", url: "https://www.tuttoilgiorno.com/location/southampton/", desc: "Stylish Italian with handmade pastas and garden seating" },
    { town: "Southampton", name: "Union Burger Bar", url: "https://unionburgerbar.com/", desc: "Casual pub for gourmet burgers and craft beer" },
    { town: "Southampton", name: "Le Charlot", url: "https://lecharlot.us/", desc: "Elegant French bistro with Provençal dishes" },

    { town: "Sag Harbor", name: "The American Hotel", url: "https://theamericanhotel.com/", desc: "Historic inn with refined French inspired dining and deep wine list" },
    { town: "Sag Harbor", name: "Le Bilboquet", url: "https://lebilboquetsag.com/", desc: "Upscale waterfront French inspired seafood and lively scene" },
    { town: "Sag Harbor", name: "Lulu Kitchen & Bar", url: "https://www.lulusagharbor.com/", desc: "Modern Mediterranean with wood fired dishes and tapas" },
    { town: "Sag Harbor", name: "Page at 63 Main", url: "https://pagesagharbor.com/", desc: "Farm to table American menu with a garden patio" },
    { town: "Sag Harbor", name: "Tutto Il Giorno", url: "https://www.tuttoilgiorno.com/location/sag-harbor/", desc: "Rustic chic Italian with seasonal coastal dishes" },

    { town: "East Hampton", name: "Nick & Toni’s", url: "https://www.nickandtonis.com/", desc: "Mediterranean inspired menu and wood fired pizzas" },
    { town: "East Hampton", name: "East Hampton Grill", url: "https://easthamptongrill.com/", desc: "Refined American grill known for rotisserie chicken and steaks" },
    { town: "East Hampton", name: "Cittanuova", url: "https://www.cittanuova.com/", desc: "Vibrant trattoria for pasta, pizza, and aperitivos" },
    { town: "East Hampton", name: "Fresno", url: "https://www.fresnorestaurant.com/", desc: "Casual upscale bistro popular for seafood and local wines" },
    { town: "East Hampton", name: "Serafina", url: "https://www.serafinarestaurant.com/east-hampton", desc: "Lively outpost serving contemporary Italian favorites" }
  ]

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="px-4 md:px-10 pt-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold">Local Information</h2>
          <p className="text-sm text-neutral-700">
            Everything you need for a smooth stay. Use the quick links below to jump around
          </p>
        </div>
      </div>

      <div className="sticky top-[64px] z-30 bg-white md:bg-white/80 backdrop-blur border-b mt-4">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          {/* mobile-friendly horizontal scroll */}
          <nav className="flex items-center gap-2 md:gap-4 py-3 text-sm overflow-x-auto no-scrollbar">
            <a href="#/info/house" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition whitespace-nowrap">House</a>
            <a href="#/info/beaches" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition whitespace-nowrap">Beaches</a>
            <a href="#/info/restaurants" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition whitespace-nowrap">Restaurants</a>
          </nav>
        </div>
      </div>

      <div className="px-4 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* House */}
          <section id="house" className="scroll-mt-28">
            <h3 className="text-lg font-semibold mb-3">House Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccordionCard title="Wi Fi" open={open.wifi} onClick={() => toggle("wifi")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Network name, staythehamptons</li>
                  <li>Password, provided after booking</li>
                  <li>Coverage, whole house, office, and pool patio</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Check in and out" open={open.checkin} onClick={() => toggle("checkin")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check in after 4 pm</li>
                  <li>Check out by 10 am</li>
                  <li>Smart lock code sent the morning of arrival</li>
                  <li>Before leaving, run the dishwasher and take trash to outdoor bins</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Garbage and recycling" open={open.trash} onClick={() => toggle("trash")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bins on the side of the house near the driveway</li>
                  <li>Trash pickup Monday and Thursday, recycling Wednesday</li>
                  <li>Break down boxes and rinse cans and bottles</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Lighting and HVAC" open={open.lighting} onClick={() => toggle("lighting")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Most lights are on dimmers, slide to adjust brightness</li>
                  <li>Pool and patio lights, switches near the back sliders</li>
                  <li>Thermostats, keep between 68 and 74 for comfort and efficiency</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Pool and outdoor" open={open.outdoor} onClick={() => toggle("outdoor")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Saltwater pool with weekly service in season</li>
                  <li>Outdoor shower by the garage walkway</li>
                  <li>Close umbrellas and secure cushions if windy</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Parking and EV" open={open.parking} onClick={() => toggle("parking")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Driveway fits four cars, garage access only if noted</li>
                  <li>Street parking rules vary by season, check posted signs</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Home office" open={open.office} onClick={() => toggle("office")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dedicated desk in a quiet room with natural light</li>
                  <li>Fast Wi-Fi with strong signal in office and common areas</li>
                  <li>Several standard outlets and a surge protected power strip</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="Emergency" open={open.emergency} onClick={() => toggle("emergency")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dial 911 for emergencies</li>
                  <li>Urgent home issues, use the host phone number in your arrival email</li>
                  <li>Nearest hospital, Stony Brook Southampton Hospital, about 20 minutes west</li>
                </ul>
              </AccordionCard>

              <AccordionCard title="House rules" open={open.rules} onClick={() => toggle("rules")}>
                <ul className="list-disc pl-5 space-y-1">
                  <li>No parties and no smoking</li>
                  <li>No pets unless approved before booking</li>
                  <li>Quiet hours after 10 pm per town guidance</li>
                </ul>
              </AccordionCard>
            </div>
          </section>

          {/* Beaches */}
          <section id="beaches" className="scroll-mt-28">
            <h3 className="text-lg font-semibold mb-3">Beaches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {beaches.map((b) => (
                <div key={b.name} className="rounded-2xl border shadow-sm bg-white p-4 hover:shadow-md transition">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-neutral-700 mt-1">{b.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Pill href={b.info}>Official info</Pill>
                    <Pill href={gmaps(b.dest)}>Directions</Pill>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-3">Parking and permits vary by town and season. Check official pages before you go</p>
          </section>

          {/* Restaurants */}
          <section id="restaurants" className="scroll-mt-28">
            <h3 className="text-lg font-semibold mb-3">Restaurants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map(r => (
                <div key={r.name} className="rounded-2xl border shadow-sm bg-white p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.name}</p>
                    <span className="text-xs rounded-full bg-neutral-100 border px-2 py-0.5">{r.town}</span>
                  </div>
                  <p className="text-sm text-neutral-700 mt-1">{r.desc}</p>
                  <div className="mt-3">
                    <a href={r.url} target="_blank" rel="noreferrer" className="underline text-sm">Website</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Back to top */}
          <div className="pt-4">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white transition"
            >
              Back to top
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Reviews page: approved reviews + submission form
 * ────────────────────────────────────────────────────────── */
function StarRating({ value = 5 }) {
  return (
    <span aria-label={`${value} stars`} className="text-yellow-500">
      {"★".repeat(value)}{"☆".repeat(Math.max(0, 5 - value))}
    </span>
  )
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/reviews.json?v=${Date.now()}`)
        if (!res.ok) throw new Error("Failed to load reviews.json")
        const data = await res.json()
        const list = Array.isArray(data?.reviews) ? data.reviews : []
        if (!cancelled) setReviews(list)
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load reviews")
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="px-4 md:px-10 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Guest Reviews</h2>

        {!loaded && <p className="text-sm text-neutral-600 mb-6">Loading reviews…</p>}
        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}
        {loaded && !error && (
          reviews.length ? (
            <ul className="space-y-4 mb-8">
              {reviews.map((r, idx) => (
                <li key={idx} className="rounded-2xl border p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{r.name || "Guest"}</p>
                    <StarRating value={Number(r.stars) || 5} />
                  </div>
                  {(r.from || r.to) && (
                    <p className="text-xs text-neutral-600 mb-2">
                      Stayed {r.from ? `from ${r.from}` : ""}{r.from && r.to ? " " : ""}{r.to ? `to ${r.to}` : ""}
                    </p>
                  )}
                  <p className="text-sm text-neutral-800 whitespace-pre-line">{r.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-600 mb-8">No reviews yet — be the first to share your stay!</p>
          )
        )}

        <h3 className="text-lg font-semibold mb-3">Share Your Stay</h3>
        <p className="text-sm text-neutral-700 mb-4">
          Submit your review below.
        </p>

        <form
          name="review-pending"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thanks.html"
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="review-pending" />
          <p className="hidden">
            <label>Don’t fill this out if you’re human <input name="bot-field" /></label>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="Name" placeholder="Your Name" required className="border rounded-lg px-3 py-3 w-full" />
            <select name="Stars" required className="border rounded-lg px-3 py-3 w-full">
              <option value="" disabled>Rating (1–5 stars)</option>
              <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Stayed From</label>
              <input type="date" name="Stayed From" className="border rounded-lg px-3 py-3 w-full" required />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Stayed To</label>
              <input type="date" name="Stayed To" className="border rounded-lg px-3 py-3 w-full" required />
            </div>
          </div>

          <textarea name="Comment" placeholder="Tell us about your stay…" rows="5" required className="border rounded-lg px-3 py-3 w-full" />
          <input type="hidden" name="Status" value="Pending" />

          <button type="submit" className="rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition">
            Submit Review
          </button>
        </form>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * US Open 2026 Landing Page (with background image)
 * ────────────────────────────────────────────────────────── */
function Countdown({ target }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  if (diff <= 0) {
    return <p className="text-lg md:text-xl font-medium">It’s U.S. Open week!</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-lg md:text-2xl font-semibold">
      <span className="rounded-xl border px-3 py-1 bg-white shadow-sm">{d}d</span>
      <span className="rounded-xl border px-3 py-1 bg-white shadow-sm">{h}h</span>
      <span className="rounded-xl border px-3 py-1 bg-white shadow-sm">{m}m</span>
      <span className="rounded-xl border px-3 py-1 bg-white shadow-sm">{s}s</span>
      <span className="text-sm md:text-base text-white drop-shadow">Until the U.S. Open</span>
    </div>
  )
}

function USOpenPage() {
  const EVENT_START = new Date("2026-06-15T08:00:00-04:00").getTime()
  const origin = encodeURIComponent("2 Hubbard Street, Hampton Bays, NY 11946")
  const shinnecock = "Shinnecock Hills Golf Club, 200 Tuckahoe Rd, Southampton, NY 11968"
  const gmaps = (dest) =>
    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  return (
    <section className="bg-gradient-to-b from-white to-slate-50">
      {/* Background hero with overlay */}
      <div
        className="relative min-h-[42vh] md:min-h-[50vh] flex items-end"
        style={{
          backgroundImage: "url('/images/shinnecock.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/35 md:bg-black/30" />
        <div className="relative w-full max-w-5xl mx-auto px-4 md:px-10 py-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-white drop-shadow">Stay for the U.S. Open 2026</h1>
          <p className="text-white/90 text-sm md:text-base mt-1 drop-shadow">
            Minutes from Shinnecock Hills, your home base for tournament week.
          </p>
          <div className="mt-4">
            <Countdown target={EVENT_START} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="#/contact" className="rounded-full border px-4 py-2 text-sm bg-white/90 hover:bg-white transition">
              Reserve Your Stay
            </a>
            <a href={gmaps(shinnecock)} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-2 text-sm bg-white/90 hover:bg-white transition">
              Directions to Shinnecock
            </a>
          </div>
        </div>
      </div>

      {/* Content cards */}
      <div className="px-4 md:px-10 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Quick facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Event Week</p>
              <p className="font-medium mt-1">June 15 - June 21</p>
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Distance</p>
              <p className="font-medium mt-1">~10 minutes drive</p>
              <p className="text-xs text-neutral-600">Traffic dependent</p>
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Guests</p>
              <p className="font-medium mt-1">Up to 10 guests • 4 bedrooms</p>
            </div>
          </div>

          {/* Transport + Why stay */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Getting There</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800">
                <li>Drive, ~10 minutes</li>
                <li>Ride-share, Uber or Lyft are available in Southampton and Hampton Bays</li>
                <li>Local car services are available, book ahead during event week</li>
                <li>Parking and shuttle details are provided by USGA, follow official guidance</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Why Our Home</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800">
                <li>Luxury 3,750 sq ft home with heated saltwater pool</li>
                <li>4 en-suite bedrooms, sleeps 10</li>
                <li>Chef’s kitchen with state of the art appliances</li>
                <li>Dedicated office with fast Wi-Fi</li>
                <li>Minutes from the golf course</li>
                <li>Great dining nearby</li>
              </ul>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">US Open Schedule</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-800">
              <li>Monday Jun 15, Practice Day 1</li>
              <li>Tuesday Jun 16, Practice Day 2</li>
              <li>Wednesday Jun 17, Practice Day 3</li>
              <li>Thursday Jun 18, Round 1</li>
              <li>Friday Jun 19, Round 2</li>
              <li>Saturday Jun 20, Round 3</li>
              <li>Sunday Jun 21, Final Round</li>
            </ol>
            <div className="mt-4">
              <a href="#/contact" className="rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white transition">
                Inquire for Event Week
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * App router
 * ────────────────────────────────────────────────────────── */
export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#/")
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/")
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Auto-scroll to Contact when #/contact is used
  useEffect(() => {
    if (route === "#/contact") {
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 0)
    }
  }, [route])

  const isInfo = route.startsWith("#/info")
  const isReviews = route.startsWith("#/reviews")
  const isUSOpen = route.startsWith("#/usopen")


  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    const setDesc = (t) => { if (meta) meta.setAttribute("content", t) }

    if (isUSOpen) {
      document.title = "U.S. Open 2026 Housing near Shinnecock Hills | Hampton Bays Rental"
      setDesc("Private Hampton Bays home minutes from Shinnecock Hills. 4BR, 5BA, heated pool. Ideal base for U.S. Open 2026 week.")
    } else if (isReviews) {
      document.title = "Guest Reviews | Hampton Bays Luxury Rental"
      setDesc("Read guest reviews for our Hampton Bays luxury rental with heated pool and bay views.")
    } else if (isInfo) {
      document.title = "Local Info | Beaches, Restaurants, House Details | Hampton Bays Rental"
      setDesc("Everything you need for a smooth stay in our Hampton Bays house rental near Shinnecock Hills.")
    } else {
      document.title = "Luxury Hamptons Rental in Hampton Bays | Heated Pool, Sleeps 10"
      setDesc("Classic cedar shingle Hamptons house rental with heated saltwater pool, 4BR/5BA, near Shinnecock Hills.")
    }
  }, [isUSOpen, isReviews, isInfo])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      {isInfo ? <InfoPage /> : isReviews ? <ReviewsPage /> : isUSOpen ? <USOpenPage /> : <HomeSections />}
      <footer className="px-4 md:px-10 py-8 border-t">
        <div className="max-w-7xl mx-auto text-sm text-neutral-600">
          © {new Date().getFullYear()} Staythehamptons.com
        </div>
      </footer>
    </main>
  )
}
