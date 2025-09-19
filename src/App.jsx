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

      {/* About above Gallery */}
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
              Ideal for families, couples, or small groups, the home balances open gathering areas with private bedroom suites. Spend your days at the beach or lounging by the saltwater pool, then unwind by the fire after dinner in town. For those who need to stay connected, the property also features a dedicated home office with plenty of natural light and fast Wi-Fi, making it easy to work remotely.
            </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:gri
