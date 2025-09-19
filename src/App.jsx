import React, { useEffect, useState, useCallback } from "react"

const images = [
  { file: "top.webp", label: "Aerial View" },
  { file: "hosue.webp", label: "Exterior Front" }, // keep as-is if file name is really "hosue.webp"
  { file: "kitchen1.webp", label: "Kitchen" },
  { file: "kitchen2.webp", label: "Chef Kitchen" },
  { file: "kitchen3.webp", label: "Chef Kitchen" },
  { file: "dining.webp", label: "Dining Area" },
  { file: "living.webp", label: "Living Room" },
  { file: "living2.webp", label: "Living Room" },
  { file: "living3.webp", label: "Living Room" },
  { file: "pool1.webp", label: "Saltwater Pool" },
  { file: "pool2.webp", label: "Pool and Patio" },
  { file: "pool3.webp", label: "Poolside" },
  { file: "pool4.webp", label: "Pool View" },
  { file: "primary.webp", label: "Primary Bedroom" },
  { file: "primary2.webp", label: "Primary Suite" },
  { file: "primarydoors.webp", label: "Primary Doors to Balcony" },
  { file: "balcony.webp", label: "Balcony View" },
  { file: "bathmain.webp", label: "Luxurious En-Suite Bathroom" },
  { file: "bathmain2.webp", label: "Luxurious En-Suite Bathroom" },
  { file: "bathmain3.webp", label: "Luxurious En-Suite Bathroom" },
  { file: "room1.webp", label: "Bedroom 2" },
  { file: "room2.webp", label: "Bedroom 3" },
  { file: "room4.webp", label: "Bedroom 4" },
  { file: "office-room.webp", label: "Office" },
  { file: "room-office2.webp", label: "Office" },
  { file: "basement1.webp", label: "Media Room" },
  { file: "basement2.webp", label: "Media Room" },
  { file: "bath1.webp", label: "Guest Bathroom" },
  { file: "bath2.webp", label: "Guest Bathroom" },
  { file: "bath4.webp", label: "Guest Bathroom" },
  { file: "foyer.webp", label: "Front Foyer" },
  { file: "foyer2.webp", label: "Entryway" },
  { file: "garage.webp", label: "Detached Garage" },
  { file: "laundry.webp", label: "Laundry Room" },
  { file: "restroom.webp", label: "Half Bath" },
  { file: "stairs.webp", label: "Staircase" }
]

export default function App() {
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
              alt="Aerial View"
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
              Welcome to your Hampton Bays getaway with bay views, a saltwater in-ground pool, and an easy drive to beaches, restaurants, and shops. This 3,750 sq ft home sleeps up to 10 across 4 bedrooms and 5 bathrooms, designed for comfort and style.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Great room with vaulted ceilings, oak floors, and a fireplace that opens to the patio and pool.</li>
              <li>Chef kitchen with Viking appliances, pot filler, Quartzite counters, and island seating.</li>
              <li>Main level includes two oversized en-suite bedrooms with direct patio access.</li>
              <li>Primary suite upstairs with two walk-in closets, private balcony with bay views luxurious en-suite bathroom with walk-in shower and standalone jacuzzi tub.</li>
              <li>Fully finished walk-out lower level with 9 ft ceilings, media room, full bath, and laundry.</li>
              <li>Central air, outdoor shower, and workout room.</li>
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
              In the heart of Hampton Bays near marinas, dining, and beaches. Quick access to the best of the Hamptons.
            </p>
            <h4 className="font-semibold mt-4">Good to know</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Saltwater pool is seasonal and professionally maintained.</li>
              <li>Outdoor shower available.</li>
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
    </main>
  )
}
