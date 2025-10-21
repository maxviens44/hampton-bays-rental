import { Helmet } from 'react-helmet-async'
import Header from '../shared/Header.jsx'
import { useEffect, useState } from 'react'

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(0, target - now)
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)
  if (diff <= 0) return <p className='text-lg md:text-xl font-medium'>It is U S Open week</p>
  return (
    <div className='flex flex-wrap items-center gap-3 text-lg md:text-2xl font-semibold'>
      <span className='rounded-xl border px-3 py-1 bg-white shadow-sm'>{d}d</span>
      <span className='rounded-xl border px-3 py-1 bg-white shadow-sm'>{h}h</span>
      <span className='rounded-xl border px-3 py-1 bg-white shadow-sm'>{m}m</span>
      <span className='rounded-xl border px-3 py-1 bg-white shadow-sm'>{s}s</span>
      <span className='text-sm md:text-base text-white drop-shadow'>Until the U S Open</span>
    </div>
  )
}

export default function USOpen2026() {
  const EVENT_START = new Date('2026-06-15T08:00:00-04:00').getTime()
  const origin = encodeURIComponent('2 Hubbard Street, Hampton Bays, NY 11946')
  const shinnecock = 'Shinnecock Hills Golf Club, 200 Tuckahoe Rd, Southampton, NY 11968'
  const gmaps = dest => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  return (
    <>
      <Header />
      <main className='bg-gradient-to-b from-white to-slate-50'>
        <Helmet>
          <title>US Open 2026 • Hampton Bays Rental</title>
          <meta name='description' content='Plan your stay for the 2026 US Open at Shinnecock Hills' />
        </Helmet>

        <div className='relative min-h-[42vh] md:min-h-[50vh] flex items-end' style={{ backgroundImage: "url('/images/shinnecock.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className='absolute inset-0 bg-black/35 md:bg-black/30' />
          <div className='relative w-full max-w-5xl mx-auto px-4 md:px-10 py-8'>
            <h1 className='text-3xl md:text-4xl font-semibold text-white drop-shadow'>Stay for the U S Open 2026</h1>
            <p className='text-white/90 text-sm md:text-base mt-1 drop-shadow'>Minutes from Shinnecock Hills, your home base for tournament week.</p>
            <div className='mt-4'><Countdown target={EVENT_START} /></div>
            <div className='mt-4 flex flex-wrap gap-2'>
              <a href='/contact' className='rounded-full border px-4 py-2 text-sm bg-white/90 hover:bg-white transition'>Reserve Your Stay</a>
              <a href={gmaps(shinnecock)} target='_blank' rel='noreferrer' className='rounded-full border px-4 py-2 text-sm bg-white/90 hover:bg-white transition'>Directions to Shinnecock</a>
            </div>
          </div>
        </div>

        <div className='px-4 md:px-10 py-8 md:py-12'>
          <div className='max-w-5xl mx-auto space-y-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='rounded-2xl border bg-white p-4 shadow-sm'>
                <p className='text-xs uppercase tracking-wide text-neutral-500'>Event Week</p>
                <p className='font-medium mt-1'>June 15 to June 21</p>
              </div>
              <div className='rounded-2xl border bg-white p-4 shadow-sm'>
                <p className='text-xs uppercase tracking-wide text-neutral-500'>Distance</p>
                <p className='font-medium mt-1'>About 10 minutes drive</p>
                <p className='text-xs text-neutral-600'>Traffic dependent</p>
              </div>
              <div className='rounded-2xl border bg-white p-4 shadow-sm'>
                <p className='text-xs uppercase tracking-wide text-neutral-500'>Guests</p>
                <p className='font-medium mt-1'>Up to 10 guests • 4 bedrooms</p>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='rounded-2xl border bg-white p-5 shadow-sm'>
                <h3 className='text-lg font-semibold mb-2'>Getting There</h3>
                <ul className='list-disc pl-5 space-y-1 text-sm text-neutral-800'>
                  <li>Drive about 10 minutes</li>
                  <li>Ride share services are available</li>
                  <li>Local car services are available, book ahead during event week</li>
                  <li>Parking and shuttle details are provided by USGA</li>
                </ul>
              </div>
              <div className='rounded-2xl border bg-white p-5 shadow-sm'>
                <h3 className='text-lg font-semibold mb-2'>Why Our Home</h3>
                <ul className='list-disc pl-5 space-y-1 text-sm text-neutral-800'>
                  <li>Luxury 3,750 sq ft home with heated saltwater pool</li>
                  <li>4 en suite bedrooms, sleeps 10</li>
                  <li>Chef’s kitchen with modern appliances</li>
                  <li>Dedicated office with fast Wi Fi</li>
                  <li>Minutes from the golf course</li>
                  <li>Great dining nearby</li>
                </ul>
              </div>
            </div>

            <div className='rounded-2xl border bg-white p-5 shadow-sm'>
              <h3 className='text-lg font-semibold mb-2'>US Open Schedule</h3>
              <ol className='list-decimal pl-5 space-y-1 text-sm text-neutral-800'>
                <li>Monday Jun 15, Practice Day 1</li>
                <li>Tuesday Jun 16, Practice Day 2</li>
                <li>Wednesday Jun 17, Practice Day 3</li>
                <li>Thursday Jun 18, Round 1</li>
                <li>Friday Jun 19, Round 2</li>
                <li>Saturday Jun 20, Round 3</li>
                <li>Sunday Jun 21, Final Round</li>
              </ol>
              <div className='mt-4'>
                <a href='/contact' className='rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white transition'>Inquire for Event Week</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className='px-4 md:px-10 py-8 border-t'>
        <div className='max-w-7xl mx-auto text-sm text-neutral-600'>© {new Date().getFullYear()} Staythehamptons.com</div>
      </footer>
    </>
  )
}
