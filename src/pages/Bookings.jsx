import { Helmet } from 'react-helmet-async'

export default function Bookings() {
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <Helmet>
        <title>Bookings • Hampton Bays Rental</title>
        <meta name='description' content='Check availability and book your stay in Hampton Bays' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>Bookings</h1>
      <p>Embed OwnerRez or your booking widget here.</p>
    </main>
  )
}
