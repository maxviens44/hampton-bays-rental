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
              This home is just a moment away from one of the best bay beaches in the Hamptons. East Landing offers endless experiences to enjoy such as 4th of July fireworks bonfires with loved ones clamming and bird watching or a relaxing day at the beach while the bay waves roll at your feet. Only point two miles from the front door this beach paradise is yours to enjoy.
            </p>
            <p>
              The beautifully crafted home is newly built by Paramount a renowned luxury construction company in the Hamptons. The residence offers ten foot ceilings and about two thousand square feet of well designed living and entertaining space with five bedrooms two and a half baths and an attached two car garage. Inside a meticulously maintained interior features an open concept layout including a light filled living room with a fireplace focal point and an eat in kitchen with stainless steel appliances.
            </p>
            <p>
              All bedrooms are located on the second floor. The primary bedroom supports a king bed and an oversized custom walk in closet. The home features upgraded designer lighting throughout including in the primary closet. Hardwood floors are also noteworthy throughout.
            </p>
            <p>
              The unfinished lower level with impressive twelve foot ceilings is memorable. Reimagine the space as more living space or a future pool house function if you add a pool. Enjoy morning coffee on the front porch and after a day at the beach retreat to the side patio with pergola to take in evening bay breezes in a private corner of the property with room for a pool and mature evergreens.
            </p>
            <p>
              The friendly hamlet of Hampton Bays is known for year round beauty and activity. You are surrounded by desirable ocean and bay beaches and have access to abundant waterfront dining. The location is also convenient to Westhampton and Southampton villages.
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
  return (
    <section id="gallery" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Gallery</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGES.map(img => (
            <figure key={img.src} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
              <img src={img.src} alt={img.alt} className="h-64 w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-700">{img.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
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
