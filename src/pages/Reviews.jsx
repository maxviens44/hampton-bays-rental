import { Helmet } from 'react-helmet-async'

export default function Reviews() {
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <Helmet>
        <title>Reviews • Hampton Bays Rental</title>
        <meta name='description' content='Guest reviews and testimonials' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>Reviews</h1>
      <p className='mb-6'>Pull in your reviews from Airbnb or OwnerRez via embed or API</p>
    </main>
  )
}
