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
      document.body.style.overflow =
