import React, { useEffect, useState, useCallback } from "react"

const images = [
  { file: "top.webp", label: "Aerial View" },
  { file: "balcony.webp", label: "Balcony View" },
  { file: "basement1.webp", label: "Finished Basement" },
  { file: "basement2.webp", label: "Basement Lounge" },
  { file: "bath1.webp", label: "Guest Bath" },
  { file: "bath2.webp", label: "Bathroom" },
  { file: "bath4.webp", label: "Full Bathroom" },
  { file: "bathmain.webp", label: "Main Bath" },
  { file: "bathmain2.webp", label: "Primary Suite Bathroom" },
  { file: "bathmain3.webp", label: "Luxury Bath" },
  { file: "dining.webp", label: "Dining Area" },
  { file: "foyer.webp", label: "Front Foyer" },
  { file: "foyer2.webp", label: "Entryway" },
  { file: "garage.webp", label: "Detached Garage" },
  { file: "hosue.webp", label: "Exterior Front" },
  { file: "kitchen1.webp", label: "Kitchen" },
  { file: "kitchen2.webp", label: "Chef Kitchen" },
  { file: "kitchen3.webp", label: "Kitchen Island" },
  { file: "laundry.webp", label: "Laundry Room" },
  { file: "living.webp", label: "Living Room" },
  { file: "living2.webp", label: "Living Room View" },
  { file: "living3.webp", label: "Living Room Detail" },
  { file: "office-room.webp", label: "Home Office" },
  { file: "pool1.webp", label: "Saltwater Pool" },
  { file: "pool2.webp", label: "Pool and Patio" },
  { file: "pool3.webp", label: "Poolside" },
  { file: "pool4.webp", label: "Evening Pool" },
  { file: "primary.webp", label: "Primary Bedroom" },
  { file: "primary2.webp", label: "Primary Suite" },
  { file: "primarydoors.webp", label: "Primary Doors to Balcony" },
  { file: "restroom.webp", label: "Half Bath" },
  { file: "room-office2.webp", label: "Secondary Office" },
  { file: "room1.webp", label: "Guest Bedroom" },
  { file: "room2.webp", label: "Bedroom 2" },
  { file: "room4.webp", label: "Bedroom 3" },
  { file: "stairs.webp", label: "Staircase" }
]

function Header({ isInfo }) {
  return (
    <header className="px-6 md:px-10 py-6 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl md:text-2xl font-semibold tracking-tight">
          2 Hubbard Street • Hampton Bays
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {!isInfo && <a href="#about" className="hover:underline">About</a>}
          {!isInfo && <a href="#gallery" className="hover:underline">Gallery</a>}
          <a href="#/info" className="hover:underline">Info</a>
          {!isInfo && <a href="#contact" className="hover:underline">Contact</a>}
        </nav>
      </div>
    </header>
  )
}

function HomeSections() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i) => {
    setIndex(i)
    setLightboxOpen(true)
  }, [])

  const close = useCallback(() => setLightboxOpen(false), [])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [])

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
              Welcome to your Hamptons getaway with bay views, a saltwater in-ground pool, and an easy drive to beaches, restaurants, and shops. This 3,750 sq ft home sleeps up to 10 across 4 bedrooms and 5 bathrooms, designed for comfort and style.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Great room with vaulted ceilings, oak floors, and a fireplace that opens to the patio and pool.</li>
              <li>Chef kitchen with Viking appliances, pot filler, Quartzite counters, and island seating.</li>
              <li>Main level includes two oversized en-suite bedrooms with direct patio access.</li>
              <li>Primary suite upstairs with two walk-in closets, spa bath with walk-in shower and standalone jacuzzi tub, and a private balcony with bay views.</li>
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
      <section id="gallery" className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Gallery</h3>
          <p className="text-sm text-neutral-600 mb-6">Click any photo to view it full screen</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

      {/* Contact with Netlify Form */}
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
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/images/${images[index].file}`}
              alt={images[index].label}
              className="w-full h-[72vh] md:h-[82vh] object-contain rounded-xl"
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
            >
              Close
            </button>

            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
            >
              Prev
            </button>

            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function InfoPage() {
  const origin = encodeURIComponent("2 Hubbard Street, Hampton Bays, NY 11946")

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
    // Hampton Bays
    { town: "Hampton Bays", name: "Rumba", url: "https://tasterumba.com/hampton-bays-ny/", desc: "Caribbean inspired spot on the water with fish tacos and rum drinks" },
    { town: "Hampton Bays", name: "Cowfish", url: "https://cowfishrestaurant.com/", desc: "Waterfront seafood, sushi, and steaks with canal views" },
    { town: "Hampton Bays", name: "Edgewater", url: "https://www.edgewaterrestaurant.com/", desc: "Classic Italian with seafood pastas and a family friendly vibe" },
    { town: "Hampton Bays", name: "Oakland’s", url: "https://oaklandsrestaurant.net/", desc: "Seasonal marina restaurant for seafood platters and sunsets" },
    { town: "Hampton Bays", name: "1 North Steakhouse", url: "https://www.1northsteakhouse.com/", desc: "Local steakhouse with hearty cuts and a busy bar scene" },
    // Southampton
    { town: "Southampton", name: "75 Main", url: "https://75main.com/", desc: "Trendy American bistro with a Hamptons social vibe" },
    { town: "Southampton", name: "Sant Ambroeus", url: "https://www.santambroeus.com/pages/location-southampton", desc: "Chic Milan style cafe and upscale Italian classics" },
    { town: "Southampton", name: "Tutto Il Giorno", url: "https://www.tuttoilgiorno.com/location/southampton/", desc: "Stylish Italian with handmade pastas and garden seating" },
    { town: "Southampton", name: "Union Burger Bar", url: "https://unionburgerbar.com/", desc: "Casual pub for gourmet burgers and craft beer" },
    { town: "Southampton", name: "Le Charlot", url: "https://lecharlot.us/", desc: "Elegant French bistro with Provençal dishes" },
    // Sag Harbor
    { town: "Sag Harbor", name: "The American Hotel", url: "https://theamericanhotel.com/", desc: "Historic inn with refined French inspired dining and deep wine list" },
    { town: "Sag Harbor", name: "Le Bilboquet", url: "https://lebilboquetsag.com/", desc: "Upscale waterfront French inspired seafood and lively scene" },
    { town: "Sag Harbor", name: "Lulu Kitchen & Bar", url: "https://www.lulusagharbor.com/", desc: "Modern Mediterranean with wood fired dishes and tapas" },
    { town: "Sag Harbor", name: "Page at 63 Main", url: "https://pagesagharbor.com/", desc: "Farm to table American menu with a garden patio" },
    { town: "Sag Harbor", name: "Tutto Il Giorno", url: "https://www.tuttoilgiorno.com/location/sag-harbor/", desc: "Rustic chic Italian with seasonal coastal dishes" },
    // East Hampton
    { town: "East Hampton", name: "Nick & Toni’s", url: "https://www.nickandtonis.com/", desc: "Mediterranean inspired menu and wood fired pizzas" },
    { town: "East Hampton", name: "East Hampton Grill", url: "https://easthamptongrill.com/", desc: "Refined American grill known for rotisserie chicken and steaks" },
    { town: "East Hampton", name: "Cittanuova", url: "https://www.cittanuova.com/", desc: "Vibrant trattoria for pasta, pizza, and aperitivos" },
    { town: "East Hampton", name: "Fresno", url: "https://www.fresnorestaurant.com/", desc: "Casual upscale bistro popular for seafood and local wines" },
    { town: "East Hampton", name: "Serafina", url: "https://www.serafinarestaurant.com/east-hampton", desc: "Lively outpost serving contemporary Italian favorites" }
  ]

  const gmaps = dest =>
    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  return (
    <section className="px-6 md:px-10 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* House Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">House Information</h2>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="text-lg font-semibold">Wi Fi</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Network name, staythehamptons</li>
                <li>Password, provided after booking</li>
                <li>Coverage, whole house, office, and pool patio</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Check in and out</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check in after 4 pm</li>
                <li>Check out by 10 am</li>
                <li>Smart lock code sent the morning of arrival</li>
                <li>Before leaving, run the dishwasher and take trash to outdoor bins</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Garbage and recycling</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bins on the side of the house near the driveway</li>
                <li>Trash pickup Monday and Thursday, recycling Wednesday</li>
                <li>Break down boxes and rinse cans and bottles</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Lighting and HVAC</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Most lights are on dimmers, slide to adjust brightness</li>
                <li>Pool and patio lights, switches near the back sliders</li>
                <li>Thermostats, keep between 68 and 74 for comfort and efficiency</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Pool and outdoor</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Saltwater pool with weekly service in season</li>
                <li>Outdoor shower by the garage walkway</li>
                <li>Close umbrellas and secure cushions if windy</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Parking and EV</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Driveway fits four cars, garage access only if noted</li>
                <li>Street parking rules vary by season, check posted signs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Home office</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dedicated desk in a quiet room with natural light</li>
                <li>Fast Wi Fi, strong signal in office and common areas</li>
                <li>Several standard outlets and a surge protected power strip</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Emergency</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dial 911 for emergencies</li>
                <li>Urgent home issues, use the host phone number in your arrival email</li>
                <li>Nearest hospital, Stony Brook Southampton Hospital, about 20 minutes west</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">House rules</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>No parties and no smoking</li>
                <li>No pets unless approved before booking</li>
                <li>Quiet hours after 10 pm per town guidance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Beaches */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Beaches</h3>
          <ul className="space-y-3">
            {beaches.map(b => (
              <li key={b.name} className="border rounded-xl p-4">
                <p className="font-medium">{b.name}</p>
                <p className="text-neutral-700 mt-1">{b.desc}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <a className="underline" href={b.info} target="_blank" rel="noreferrer">Official info</a>
                  <a className="underline" href={gmaps(b.dest)} target="_blank" rel="noreferrer">Directions</a>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-500 mt-2">Parking and permits vary by town and season. Check official pages before you go.</p>
        </div>

        {/* Restaurants */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Restaurants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Hampton Bays", "Southampton", "Sag Harbor", "East Hampton"].map(town => (
              <div key={town} className="space-y-2">
                <p className="font-medium">{town}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {restaurants.filter(r => r.town === town).map(r => (
                    <li key={r.name}>
                      <a href={r.url} target="_blank" rel="noreferrer" className="underline">{r.name}</a>
                      <div className="text-neutral-700">{r.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">Summer reservations book up quickly. Check Resy or OpenTable.</p>
        </div>

      </div>
    </section>
  )
}



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
      <Header isInfo={isInfo} />
      {isInfo ? <InfoPage /> : <HomeSections />}
      <footer className="px-6 md:px-10 py-8 border-t">
        <div className="max-w-7xl mx-auto text-sm text-neutral-600">
          © {new Date().getFullYear()} Hamptons Rental
        </div>
      </footer>
    </main>
  )
}
