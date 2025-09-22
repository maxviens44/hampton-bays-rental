import React, { useEffect, useState, useCallback } from "react"

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
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </header>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Availability Calendar (VIEW-ONLY, fed by /availability.json)
 *  - Default: all dates available
 *  - Any date in /availability.json.booked[] is shown as Booked
 *  - Shows current month + next 11 months
 * ────────────────────────────────────────────────────────── */
function AvailabilityCalendar({ months = 12 }) {
  const [booked, setBooked] = useState(() => new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Cache-bust so updates show immediately after deploys
        const res = await fetch(`/availability.json?v=${Date.now()}`)
        if (!res.ok) throw new Error("Failed to load availability.json")
        const data = await res.json()
        const dates = Array.isArray(data?.booked) ? data.booked : []
        if (!cancelled) setBooked(new Set(dates))
      } catch {
        // If missing or invalid, just keep everything available
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
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{name}</h4>
          {/* no "view only" badge for visitors */}
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
            const isBooked = booked.has(iso)
            const past = isPast(year, month, d)
            const base = "aspect-square flex items-center justify-center rounded-md border transition select-none"
            const stateCls = isBooked
              ? "bg-neutral-200 line-through text-neutral-500"
              : "bg-white"
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

      {!loaded && (
        <div className="text-sm text-neutral-500 mb-2">Loading calendar…</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {monthsList.map(({ year, month, key }) => (
          <Month key={key} year={year} month={month} />
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────── *
 * Home (hero, about, gallery, contact + calendar)
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
    </>
  )
}

/* Contact + Calendar (no login UI; calendar is view-only) */
function ContactSection() {
  return (
    <section id="contact" className="px-6 md:px-10 py-8 md:py-12 border-t">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Contact</h3>
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
          <p className="hidden">
            <label>
              Don’t fill this out if you’re human
              <input name="bot-field" />
            </label>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="First Name" placeholder="First Name" required className="border rounded-lg px-3 py-2 w-full" />
            <input type="text" name="Last Name" placeholder="Last Name" required className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" name="Email" placeholder="Email" required className="border rounded-lg px-3 py-2 w-full" />
            <input type="tel" name="Phone" placeholder="Phone" className="border rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="Desired Dates" required className="border rounded-lg px-3 py-2 w-full" />
            <input type="number" name="Number of Nights" placeholder="Number of Nights" min="1" required className="border rounded-lg px-3 py-2 w-full" />
          </div>

          <button type="submit" className="rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition">
            Submit Inquiry
          </button>
        </form>

        {/* Calendar directly under the form */}
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

  const gmaps = dest =>
    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  // Deep links like #/info/house
  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const handle = () => {
      const h = window.location.hash || ""
      const m = h.match(/^#\/info\/([a-z-]+)/i)
      if (m && m[1]) setTimeout(() => scrollToId(m[1]), 0)
    }
    handle()
    window.addEventListener("hashchange", handle)
    return () => window.removeEventListener("hashchange", handle)
  }, [])

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="px-6 md:px-10 pt-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold">Local Information</h2>
          <p className="text-sm text-neutral-700">
            Everything you need for a smooth stay. Use the quick links below to jump around
          </p>
        </div>
      </div>

      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur border-b mt-4">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <nav className="flex items-center gap-4 py-3 text-sm">
            <a href="#/info/house" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition">House</a>
            <a href="#/info/beaches" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition">Beaches</a>
            <a href="#/info/restaurants" className="px-3 py-1 rounded-full border hover:bg-black hover:text-white transition">Restaurants</a>
          </nav>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 md:py-12">
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
 * App router
 * ────────────────────────────────────────────────────────── */
export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#/")
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/")
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  const isInfo = route.startsWith("#/info")

  return (
    <main className="min-h-screen bg-white">
      <Header />
      {isInfo ? <InfoPage /> : <HomeSections />}
      <footer className="px-6 md:px-10 py-8 border-t">
        <div className="max-w-7xl mx-auto text-sm text-neutral-600">
          © {new Date().getFullYear()} Hamptons Rental
        </div>
      </footer>
    </main>
  )
}
