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
  { file: "room-office2.webp", label: "Home Office" }
]

/* ────────────────────────────────────────────────────────── *
 * Utility hooks and helpers
 * ────────────────────────────────────────────────────────── */
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || "#home")
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#home")
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])
  return [route, setRoute]
}

function classNames(...s) {
  return s.filter(Boolean).join(" ")
}

/* ────────────────────────────────────────────────────────── *
 * Simple Link component for hash routing
 * ────────────────────────────────────────────────────────── */
function Link({ href, className, children }) {
  const onClick = e => {
    if (href?.startsWith("#")) {
      e.preventDefault()
      window.location.hash = href
      const id = href.replace(/^#\/?/, "")
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Gallery with lightbox
 * ────────────────────────────────────────────────────────── */
function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  const open = useCallback(i => {
    setCurrent(i)
    setLightboxOpen(true)
  }, [])

  const close = useCallback(() => setLightboxOpen(false), [])

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % images.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + images.length) % images.length)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = e => {
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
            </div>
          </div>
        </div>
      </section>

      {/* Image grid */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {images.map((img, i) => (
            <button
              key={img.file + i}
              type="button"
              className="relative group focus:outline-none"
              onClick={() => open(i)}
            >
              <img
                src={`/images/${img.file}`}
                alt={img.label}
                className="w-full h-32 sm:h-40 md:h-44 object-cover rounded-lg"
                loading="lazy"
                width="600"
                height="400"
              />
              <span className="absolute bottom-1 left-1 text-[10px] md:text-xs bg-white/90 rounded px-1 py-0.5">
                {img.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close"
            className="absolute top-3 right-3 text-white text-2xl"
            onClick={close}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-white"
            onClick={prev}
          >
            ‹
          </button>
          <img
            src={`/images/${images[current].file}`}
            alt={images[current].label}
            className="max-h-[80vh] max-w-[90vw] rounded"
          />
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-white"
            onClick={next}
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Pricing tooltip utility
 * ────────────────────────────────────────────────────────── */
function formatCurrency(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
  } catch {
    return `$${amount}`
  }
}

/* ────────────────────────────────────────────────────────── *
 * Availability calendar with hover pricing
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

  const monthsToRender = useMemo(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const out = []
    for (let i = 0; i < months; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
      out.push({ y: d.getFullYear(), m: d.getMonth() })
    }
    return out
  }, [months])

  const getPriceFor = dateStr => {
    if (overrides[dateStr] && typeof overrides[dateStr] === "number") return overrides[dateStr]
    return defaultPrice
  }

  const onMouseEnter = (e, dateStr) => {
    const price = getPriceFor(dateStr)
    const rect = e.currentTarget.getBoundingClientRect()
    setTip({
      open: true,
      text: `${formatCurrency(price, currency)} per night`,
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    })
  }

  const onMouseLeave = () => hideTip()

  const isBooked = dateStr => booked.has(dateStr)

  return (
    <div className="mt-8">
      <h3 className="text-base md:text-lg font-semibold mb-2">Availability</h3>
      {!loaded && <p className="text-sm text-neutral-600">Loading calendar…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {monthsToRender.map(({ y, m }) => {
          const monthStart = new Date(y, m, 1)
          const monthLabel = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })
          const firstDay = new Date(y, m, 1).getDay()
          const daysInMonth = new Date(y, m + 1, 0).getDate()

          const days = []
          for (let i = 0; i < firstDay; i++) days.push(null)
          for (let d = 1; d <= daysInMonth; d++) days.push(d)

          return (
            <div key={`${y}-${m}`} className="border rounded-xl p-3">
              <div className="text-sm font-medium mb-2">{monthLabel}</div>
              <div className="grid grid-cols-7 gap-1 text-xs text-center">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(h => (
                  <div key={h} className="text-neutral-500">{h}</div>
                ))}
                {days.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />
                  const dateStr = new Date(y, m, day).toISOString().slice(0, 10)
                  const bookedDay = isBooked(dateStr)
                  return (
                    <div
                      key={dateStr}
                      className={classNames(
                        "cal-day select-none rounded p-2 border",
                        bookedDay ? "bg-neutral-200 text-neutral-500 line-through" : "bg-white"
                      )}
                      onMouseEnter={e => onMouseEnter(e, dateStr)}
                      onMouseLeave={onMouseLeave}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {tip.open && (
        <div
          className="fixed pointer-events-none px-2 py-1 text-xs bg-black text-white rounded"
          style={{ left: tip.x, top: tip.y, transform: "translate(-50%, -100%)" }}
        >
          {tip.text}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────── *
 * OwnerRez Calendar embed
 * ────────────────────────────────────────────────────────── */
function OwnerRezCalendar() {
  const holderRef = React.useRef(null)

  React.useEffect(() => {
    let cancelled = false

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector("script[data-ownerrez-script='true']")
        if (existing) {
          resolve()
          return
        }
        const s = document.createElement("script")
        s.src = "https://app.ownerrez.com/widget.js"
        s.async = true
        s.setAttribute("data-ownerrez-script", "true")
        s.onload = () => resolve()
        s.onerror = () => reject(new Error("OwnerRez widget.js failed to load"))
        document.body.appendChild(s)
      })

    const mountWidget = async () => {
      await ensureScript()
      if (cancelled || !holderRef.current) return

      holderRef.current.innerHTML = ""

      const div = document.createElement("div")
      div.className = "ownerrez-widget"
      div.setAttribute("data-propertyId", "1e98a72325d64e558e7deaf03bac1280")
      div.setAttribute("data-widget-type", "Yearly - Multiple Month Calendar")
      div.setAttribute("data-widgetId", "446daf1d6a224fce8fa842019bd1d382")
      holderRef.current.appendChild(div)

      try {
        if (window.OwnerRez && window.OwnerRez.Widgets && typeof window.OwnerRez.Widgets.init === "function") {
          window.OwnerRez.Widgets.init()
        }
      } catch {}
    }

    mountWidget()

    return () => { cancelled = true }
  }, [])

  return (
    <section className="mt-8">
      <h3 className="text-base md:text-lg font-semibold mb-2">Availability</h3>
      <div ref={holderRef} />
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Contact form with compact calendar
 * ────────────────────────────────────────────────────────── */
function ContactSection() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    const ms = b - a
    if (isNaN(ms) || ms <= 0) return 0
    return Math.round(ms / 86400000)
  }, [checkIn, checkOut])

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-3">Contact and Booking</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
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
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="border rounded-lg px-3 py-3 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Check-out</label>
              <input
                type="date"
                name="Check-out"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="border rounded-lg px-3 py-3 w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="Adults" min="1" placeholder="Adults" className="border rounded-lg px-3 py-3 w-full" />
            <input type="number" name="Children" min="0" placeholder="Children" className="border rounded-lg px-3 py-3 w-full" />
          </div>

          <textarea name="Message" placeholder="Tell us about your trip" className="border rounded-lg px-3 py-3 w-full h-28" />

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 bg-black text-white hover:bg-white hover:text-black hover:border-black transition"
          >
            Submit Inquiry
          </button>
        </form>

        {/* OwnerRez calendar embed replaces the local calendar */}
        <OwnerRezCalendar />
        {/* If you want to keep your internal calendar too, remove the comment below */}
        {/* <AvailabilityCalendar months={12} /> */}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Info and other sections
 * ────────────────────────────────────────────────────────── */
function InfoPage() {
  return (
    <section id="info" className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-3">House Information</h2>
      <p className="text-sm md:text-base text-neutral-700">
        Spacious home in Hampton Bays with heated saltwater pool, near ocean and bay beaches
      </p>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Header and routing
 * ────────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="#home" className="text-base md:text-lg font-semibold">StayTheHamptons</Link>
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link href="#about" className="px-2 py-1">About</Link>
          <Link href="#gallery" className="px-2 py-1">Gallery</Link>
          <Link href="#/info" className="px-2 py-1">Info</Link>
          <Link href="#/reviews" className="px-2 py-1">Reviews</Link>
          <Link href="#/usopen" className="px-2 py-1">US Open 2026</Link>
          <Link href="#/contact" className="px-2 py-1">Contact</Link>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2 bg-white shadow-sm"
          onClick={() => setOpen(v => !v)}
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

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-lg">
          <nav className="px-4 py-3 grid gap-1 text-base">
            <Link href="#about" className="px-2 py-2">About</Link>
            <Link href="#gallery" className="px-2 py-2">Gallery</Link>
            <Link href="#/info" className="px-2 py-2">Info</Link>
            <Link href="#/reviews" className="px-2 py-2">Reviews</Link>
            <Link href="#/usopen" className="px-2 py-2">US Open 2026</Link>
            <Link href="#/contact" className="px-2 py-2">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Main App
 * ────────────────────────────────────────────────────────── */
export default function App() {
  const [route] = useHashRoute()

  return (
    <div id="home">
      <Header />
      <Gallery />

      <section id="about" className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">About</h2>
        <p className="text-sm md:text-base text-neutral-700">
          Modern cedar shingle home with heated saltwater pool, four bedrooms, five baths, close to beaches and restaurants
        </p>
      </section>

      <InfoPage />

      <ContactSection />
    </div>
  )
}
