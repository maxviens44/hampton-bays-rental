import React, { useEffect, useState, useCallback } from "react"

const fileNames = [
  "balcony.webp",
  "basement1.webp",
  "basement2.webp",
  "bath1.webp",
  "bath2.webp",
  "bath4.webp",
  "bathmain.webp",
  "bathmain2.webp",
  "bathmain3.webp",
  "dining.webp",
  "foyer.webp",
  "foyer2.webp",
  "garage.webp",
  "hosue.webp",
  "kitchen1.webp",
  "kitchen2.webp",
  "kitchen3.webp",
  "laundry.webp",
  "living.webp",
  "living2.webp",
  "living3.webp",
  "office-room.webp",
  "planbasement.webp",
  "planmain.webp",
  "plansecond.webp",
  "pool1.webp",
  "pool2.webp",
  "pool3.webp",
  "pool4.webp",
  "primary.webp",
  "primary2.webp",
  "primarydoors.webp",
  "restroom.webp",
  "room-office2.webp",
  "room1.webp",
  "room2.webp",
  "room4.webp",
  "stairs.webp",
  "top.webp",
]

function labelFromFile(name) {
  const base = name.replace(".webp", "").replace(/-/g, " ")
  return base.charAt(0).toUpperCase() + base.slice(1)
}

export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i) => {
    setIndex(i)
    setLightboxOpen(true)
  }, [])

  const close = useCallback(() => setLightboxOpen(false), [])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % fileNames.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + fileNames.length) % fileNames.length)
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 md:px-10 py-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            2 Hubbard St • Hampton Bays
          </h1>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#gallery" className="hover:underline">Gallery</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-0 py-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <img
              src="/images/top.webp"
              alt="Top"
              className="w-full h-[46vh] md:h-[62vh] object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <h2 className="text-white text-2xl md:text-4xl font-semibold drop-shadow">
                Modern coastal retreat with pool
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* About above Gallery */}
      <section id="about" className="px-6 md:px-10 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">About</h3>
          <div className="space-y-4 text-neutral-800">
            <p>
              Welcome to your Hampton Bays getaway with bay views, a saltwater in-ground pool, and an easy drive to beaches, restaurants, and shops. This 3,750 sq ft home sleeps up to 10 across 4 bedrooms and 5 bathrooms, designed for comfort and style
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Great room with vaulted ceilings, oak floors, and a fireplace that opens to the patio and pool.</li>
              <li>Chef kitchen with Viking appliances, pot filler, Quartzite counters, and island seating.</li>
              <li>Main level includes two oversized en-suite bedrooms with direct patio access.</li>
              <li>Primary suite upstairs with two walk-in closets, spa bath with walk-in shower and standalone jacuzzi tub, and a private balcony with bay views.</li>
              <li>Fully finished walk-out lower level with 9 ft ceilings, media room, full bath, and laundry.</li>
              <li>Central air, outdoor shower, and workout room.
            </ul>
            <p>
             Ideal for families, couples, or small groups, the home balances open gathering areas with private bedroom suites. Spend your days at the beach or lounging by the saltwater pool, then unwind by the fire after dinner in town. For those who need to stay connected, the property also features a dedicated home office with plenty of natural light and fast Wi-Fi, making it easy to work remotely.
            </p>
            <h4 className="font-semibold mt-4">Sleeping configuration</h4>
            <p className="text-sm">
              4 bedrooms total. Primary suite upstairs plus two en-suite bedrooms on the main level and one guest room on the lower level.
            </p>
            <h4 className="font-semibold mt-4">Location</h4>
            <p className="text-sm">
              In the heart of Hampton Bays near marinas, dining, and beaches. Quick access to the best of the Hamptons
            </p>
            <h4 className="font-semibold mt-4">Good to know</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Saltwater pool is seasonal and professionally maintained</li>
              <li>Outdoor shower available</li>
             </ul>
            <div className="mt-6">
              <a
                href="#contact"
                className="inline-block rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition"
              >
                Check availability and rates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Gallery</h3>
          <p className="text-sm text-neutral-600 mb-6">
            Click any photo to view it full screen
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {fileNames.map((fname, idx) => {
              const src = `/images/${fname}`
              const label = labelFromFile(fname)
              return (
                <button
                  key={src}
                  onClick={() => openAt(idx)}
                  className="group relative focus:outline-none"
                  aria-label={`Open ${label}`}
                >
                  <img
                    src={src}
                    alt={label}
                    loading={idx < 6 ? "eager" : "lazy"}
                    className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-sm transform transition-transform duration-200 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 md:px-10 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Contact</h3>
          <p className="text-neutral-700">
            For availability and rates, reach out through your preferred booking platform or email
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-8 border-t">
        <div className="max-w-7xl mx-auto text-sm text-neutral-600">
          © {new Date().getFullYear()} Hampton Bays Rental
        </div>
      </footer>

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
              src={`/images/${fileNames[index]}`}
              alt={labelFromFile(fileNames[index])}
              className="w-full h-[72vh] md:h-[82vh] object-contain rounded-xl"
            />

            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
            >
              Close
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white px-3 py-2 text-sm shadow"
            >
              Prev
            </button>

            {/* Next */}
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
    </main>
  )
}
