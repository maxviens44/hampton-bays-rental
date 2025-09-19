import React from "react"
import { motion } from "framer-motion"

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
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 md:px-10 py-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            2 Hubbard St • Hampton Bays
          </h1>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#gallery" className="hover:underline">Gallery</a>
            <a href="#about" className="hover:underline">About</a>
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

      {/* Gallery */}
      <section id="gallery" className="px-6 md:px-10 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Gallery</h3>
          <p className="text-sm text-neutral-600 mb-6">
            All photos below are synced from the repository images you provided.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {fileNames.map((fname, idx) => {
              const src = `/images/${fname}`
              const label = labelFromFile(fname)
              return (
                <figure key={src} className="group">
                  <motion.img
                    src={src}
                    alt={label}
                    loading={idx < 6 ? "eager" : "lazy"}
                    className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-sm"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  />
                  <figcaption className="text-xs text-neutral-600 mt-2 px-1">
                    {label}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>

      {/* About placeholder. You said you will update this with the new Airbnb text */}
      <section id="about" className="px-6 md:px-10 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">About</h3>
          <p className="text-neutral-700">
            Replace this block with your new Airbnb listing text. If you paste the final copy here,
            I will wire it in and format it with headings, amenities, and a booking CTA.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 md:px-10 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Contact</h3>
          <p className="text-neutral-700">
            For availability and rates, reach out through your preferred booking platform or email.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-8 border-t">
        <div className="max-w-7xl mx-auto text-sm text-neutral-600">
          © {new Date().getFullYear()} Hampton Bays Rental
        </div>
      </footer>
    </main>
  )
}
