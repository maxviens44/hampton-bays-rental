import { Helmet } from 'react-helmet-async'

export default function USOpen2026() {
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <Helmet>
        <title>US Open 2026 • Hampton Bays Rental</title>
        <meta name='description' content='Plan your stay for the 2026 US Open at Shinnecock' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>US Open 2026</h1>
      <ul className='list-disc pl-6 space-y-2'>
        <li>Distance to Shinnecock Hills</li>
        <li>Premium week pricing and availability</li>
        <li>Transportation tips and local dining</li>
      </ul>
    </main>
  )
}
