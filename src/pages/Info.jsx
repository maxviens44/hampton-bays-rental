import { Helmet } from 'react-helmet-async'
import Header from '../shared/Header.jsx'
import { useState } from 'react'

function Chevron({ open }) {
  return (
    <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
      <path d='M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z' />
    </svg>
  )
}
function Pill({ children, href }) {
  return <a href={href} target='_blank' rel='noreferrer' className='inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs hover:bg-black hover:text-white transition'>{children}</a>
}
function AccordionCard({ title, open, onClick, children }) {
  return (
    <div className='rounded-2xl border shadow-sm bg-white'>
      <button onClick={onClick} className='w-full flex items-center justify-between px-4 py-3'>
        <span className='font-medium'>{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className='px-5 pb-4 text-sm'>{children}</div>}
    </div>
  )
}

export default function Info() {
  const origin = encodeURIComponent('2 Hubbard Street, Hampton Bays, NY 11946')
  const gmaps = dest => `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(dest)}`

  const [open, setOpen] = useState({ wifi: true, checkin: true, trash: false, lighting: false, outdoor: false, parking: false, office: false, emergency: false, rules: false })
  const toggle = key => setOpen(s => ({ ...s, [key]: !s[key] }))

  const beaches = [
    { name: 'Ponquogue Beach', desc: 'Wide ocean beach with soft sand and seasonal facilities', info: 'https://www.southamptontownny.gov/facilities/facility/details/Ponquogue-Beach-Pavilion-34', dest: 'Ponquogue Beach, Dune Rd, Hampton Bays, NY' },
    { name: 'Tiana Beach', desc: 'Family friendly ocean spot with pavilion area and gentle surf', info: 'https://www.southamptontownny.gov/facilities/facility/details/tianabeachandpavilion-36', dest: 'Tiana Beach, Dune Rd, Hampton Bays, NY' },
    { name: 'Meschutt Beach County Park', desc: 'Bay beach with calmer water and easy food options', info: 'https://suffolkcountyny.gov/Departments/Parks/Our-Parks/Meschutt-Beach-County-Park', dest: 'Meschutt Beach County Park, Hampton Bays, NY' },
    { name: 'Shinnecock East County Park', desc: 'Natural oceanfront near the inlet with fewer structures', info: 'https://www.suffolkcountyny.gov/Departments/Parks/Our-Parks/Shinnecock-East-County-Park', dest: 'Shinnecock East County Park, Dune Rd, Southampton, NY' }
  ]
  const restaurants = [
    { town: 'Hampton Bays', name: 'Rumba', url: 'https://tasterumba.com/hampton-bays-ny/', desc: 'Caribbean inspired spot on the water with fish tacos and rum drinks' },
    { town: 'Hampton Bays', name: 'Cowfish', url: 'https://cowfishrestaurant.com/', desc: 'Waterfront seafood, sushi, and steaks with canal views' }
  ]

  return (
    <>
      <Header />
      <main className='bg-gradient-to-b from-slate-50 to-white'>
        <Helmet>
          <title>Local Info • Hampton Bays Rental</title>
          <meta name='description' content='Beaches, restaurants, and house details for your stay' />
        </Helmet>

        <div className='px-4 md:px-10 pt-8'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-2xl font-semibold'>Local Information</h2>
            <p className='text-sm text-neutral-700'>Everything you need for a smooth stay</p>
          </div>
        </div>

        <div className='px-4 md:px-10 py-8 md:py-12'>
          <div className='max-w-5xl mx-auto space-y-12'>
            <section id='house' className='scroll-mt-28'>
              <h3 className='text-lg font-semibold mb-3'>House Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AccordionCard title='Wi Fi' open={open.wifi} onClick={() => toggle('wifi')}>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Network name, staythehamptons</li>
                    <li>Password, provided after booking</li>
                    <li>Coverage, whole house, office, and pool patio</li>
                  </ul>
                </AccordionCard>

                <AccordionCard title='Check in and out' open={open.checkin} onClick={() => toggle('checkin')}>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Check in after 4 pm</li>
                    <li>Check out by 10 am</li>
                    <li>Smart lock code sent the morning of arrival</li>
                    <li>Before leaving, run the dishwasher and take trash to outdoor bins</li>
                  </ul>
                </AccordionCard>
              </div>
            </section>

            <section id='beaches' className='scroll-mt-28'>
              <h3 className='text-lg font-semibold mb-3'>Beaches</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {beaches.map(b => (
                  <div key={b.name} className='rounded-2xl border shadow-sm bg-white p-4 hover:shadow-md transition'>
                    <p className='font-medium'>{b.name}</p>
                    <p className='text-sm text-neutral-700 mt-1'>{b.desc}</p>
                    <div className='mt-3 flex flex-wrap gap-2'>
                      <Pill href={b.info}>Official info</Pill>
                      <Pill href={gmaps(b.dest)}>Directions</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id='restaurants' className='scroll-mt-28'>
              <h3 className='text-lg font-semibold mb-3'>Restaurants</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {restaurants.map(r => (
                  <div key={r.name} className='rounded-2xl border shadow-sm bg-white p-4 hover:shadow-md transition'>
                    <div className='flex items-center justify-between'>
                      <p className='font-medium'>{r.name}</p>
                      <span className='text-xs rounded-full bg-neutral-100 border px-2 py-0.5'>{r.town}</span>
                    </div>
                    <p className='text-sm text-neutral-700 mt-1'>{r.desc}</p>
                    <div className='mt-3'>
                      <a href={r.url} target='_blank' rel='noreferrer' className='underline text-sm'>Website</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className='px-4 md:px-10 py-8 border-t'>
        <div className='max-w-7xl mx-auto text-sm text-neutral-600'>© {new Date().getFullYear()} Staythehamptons.com</div>
      </footer>
    </>
  )
}
