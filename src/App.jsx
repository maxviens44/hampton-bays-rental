import { useEffect, useState } from "react"

const IMAGES = [
  { src: "/images/main.webp", alt: "Front exterior of the Hampton Bays home" },
  { src: "/images/beache.webp", alt: "Nearby bay beach" },
  { src: "/images/pergola.webp", alt: "Patio with pergola" },
  { src: "/images/aerial-view.webp", alt: "Aerial view showing proximity to beach" },
  { src: "/images/kitchen.webp", alt: "Kitchen with stainless appliances" },
  { src: "/images/dining-room.webp", alt: "Dining room" },
  { src: "/images/livingroom.webp", alt: "Living room with fireplace" },
  { src: "/images/entrance.webp", alt: "Entryway" },
  { src: "/images/mainfloor-bathroom.webp", alt: "Main floor bathroom" },
  { src: "/images/second-bedroom.webp", alt: "Bedroom" },
  { src: "/images/onsuite-bathroom.webp", alt: "Primary ensuite bathroom" },
  { src: "/images/second-floor-full-bath.webp", alt: "Second floor full bathroom" },
  { src: "/images/third-bedroom.webp", alt: "Third bedroom with desk loft" },
  { src: "/images/fourth-bedroom.webp", alt: "Fourth bedroom" },
  { src: "/images/master-bedroom.webp", alt: "Primary bedroom" },
  { src: "/images/garage.webp", alt: "Two car garage" }
]

const FORM_ACTION = "#"

function ImageHero() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % IMAGES.length), 4500)
    return () => clearInterval(id)
  }, [])
  const current = IMAGES[index]
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <img src={current.src} alt={current.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-white/40" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <div className="max-w-2xl rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Hampton Bays Summer Home</h1>
          <p className="mt-3 text-gray-700">Elegant five bedroom home a short walk to East Landing Bay Beach in Hampton Bays NY</p>
          <div className="mt-5 flex gap-3">
            <a href="#gallery" className="rounded-xl bg-gray-900 px-5 py-3 text-white shadow hover:bg-gray-800 transition">View Gallery</a>
            <a href="#inquire" className="rounded-xl bg-white px-5 py-3 text-gray-900 ring-1 ring-gray-300 shadow hover:bg-gray-50 transition">Inquire</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#home" className="text-lg font-semibold tracking-tight">Hampton Bays Rental</a>
        <button aria-label="Toggle menu" className="sm:hidden rounded-md p-2 ring-1 ring-gray-300" onClick={() => setOpen(!open)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <nav className={`sm:flex ${open ? "block" : "hidden"}`}>
          <ul className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <li><a className="hover:text-gray-900 text-gray-700" href="#highlights">Highlights</a></li>
            <li><a className="hover:text-gray-900 text-gray-700" href="#about">About</a></li>
            <li><a className="hover:text-gray-900 text-gray-700" href="#gallery">Gallery</a></li>
            <li><a className="hover:text-gray-900 text-gray-700" href="#inquire">Inquiry</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Highlights() {
  const items = [
    { label: "Walk to Bay Beach", value: ".2 miles to East Landing" },
    { label: "Bedrooms", value: "5" },
    { label: "Bathrooms", value: "2.5" },
    { label: "Living Space", value: "About 2,000 sq ft" },
    { label: "Amenities", value: "Pool, jacuzzi and outdoor kitchen" },
    { label: "Parking", value: "Attached 2 car garage" }
  ]
  return (
    <section id="highlights" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Highlights</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(it => (
            <div key={it.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{it.label}</p>
              <p className="mt-1 text-lg text-gray-900">{it.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">About The Home</h2>
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
          <div className="prose max-w-none text-gray-700">
           <p>
  Just steps from one of the best bay beaches in the Hamptons, this newly built five-bedroom, three-bath home offers the perfect mix of modern comfort and coastal charm. Only 0.2 miles from the front door, you can spend your days with bay waves rolling at your feet, or head just a few minutes further to experience the world-famous ocean beaches the Hamptons are known for.
</p>
<p>
  Inside, the home features more than 2,000 square feet of bright and airy living space with soaring ten-foot ceilings. The open layout includes a light-filled living room with a fireplace as the focal point, flowing seamlessly into a well-appointed eat-in kitchen. Four bedrooms are located on the second floor, while a private fifth bedroom is tucked away in the finished lower level. Throughout the home, you’ll find hardwood floors, upgraded designer lighting, and thoughtful touches that make the space as stylish as it is comfortable.
</p>
<p>
  The lower level is a true entertainment hub, boasting twelve-foot ceilings, a home theater, and a ping pong table. Step outside and you’ll find your own private oasis: a 16x40 pool and jacuzzi set up for relaxation or fun in the sun. Whether you’re gathering with friends or enjoying a quiet escape, the setting is designed to make every moment memorable.
</p>
<p>
  Located in the friendly hamlet of Hampton Bays, the home offers year-round beauty and activity. You’ll be surrounded by desirable bay and ocean beaches and can take advantage of abundant waterfront dining. With easy access to both Westhampton and Southampton villages, this retreat is perfectly situated for beach days, fine dining, and exploring all that the Hamptons has to offer.
</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {IMAGES.slice(0,4).map(img => (
              <img key={img.src} src={img.src} alt={img.alt} className="h-40 w-full rounded-2xl object-cover shadow" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % IMAGES.length)
      if (e.key === 'ArrowLeft') setCurrent((i) => (i - 1 + IMAGES.length) % IMAGES.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="gallery" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Gallery</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGES.map((img, idx) => (
            <figure
              key={img.src}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm cursor-zoom-in"
              onClick={() => { setCurrent(idx); setOpen(true) }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" className="h-64 w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-700">{img.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow"
            onClick={(e) => { e.stopPropagation(); setOpen(false) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <button
            aria-label="Previous"
            className="absolute left-3 sm:left-6 rounded-full bg-white/80 p-2 shadow"
            onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i - 1 + IMAGES.length) % IMAGES.length) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"/></svg>
          </button>

          <img
            src={IMAGES[current].src}
            alt={IMAGES[current].alt}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            aria-label="Next"
            className="absolute right-3 sm:right-6 rounded-full bg-white/80 p-2 shadow"
            onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % IMAGES.length) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"/></svg>
          </button>

          <div className="absolute bottom-4 mx-auto max-w-4xl px-3 text-center text-sm text-white/90">
            {IMAGES[current].alt}
          </div>
        </div>
      )}
    </section>
  )
}

function InquiryForm() {
  return (
    <section id="inquire" className="bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Inquiry Form</h2>
        <p className="mt-2 text-gray-700">Tell us your dates group size and any questions. We will get back to you quickly.</p>
        <form action={FORM_ACTION} method="POST" onSubmit={e => e.preventDefault()} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow">
          <input type="hidden" name="_subject" value="Hampton Bays Rental Inquiry" />
          <input type="text" name="_gotcha" className="hidden" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700">First name</label>
              <input required name="first_name" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Last name</label>
              <input required name="last_name" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input required type="email" name="email" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input name="phone" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Check in</label>
              <input required type="date" name="check_in" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Check out</label>
              <input required type="date" name="check_out" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Guests</label>
              <input required type="number" min="1" name="guests" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Pets</label>
              <select name="pets" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Message</label>
            <textarea required name="message" rows={5} placeholder="Share any questions or details" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-gray-900 px-5 py-3 text-white shadow hover:bg-gray-800 transition">Send Inquiry</button>
          <p className="text-xs text-gray-500">By submitting you consent to being contacted about this rental</p>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} Hampton Bays Summer Rental</p>
          <p><a href="#home" className="hover:text-gray-900">Back to top</a></p>
        </div>
      </div>
    </footer>
  )
}

export default function HamptonBaysRental() {
  useEffect(() => {
    const onClick = e => {
      const a = e.target.closest("a[href^='#']")
      if (!a) return
      const id = a.getAttribute("href")
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <div className="text-gray-900">
      <Nav />
      <ImageHero />
      <Highlights />
      <About />
      <Gallery />
      <InquiryForm />
      <Footer />
    </div>
  )
}
