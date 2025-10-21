import { Helmet } from 'react-helmet-async'

export default function Gallery() {
  return (
    <main className='max-w-6xl mx-auto p-6'>
      <Helmet>
        <title>Gallery • Hampton Bays Rental</title>
        <meta name='description' content='Photos of the home, pool and local attractions' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>Gallery</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {/* Drop your images here */}
        <div className='aspect-[4/3] bg-gray-100 rounded-2xl' />
        <div className='aspect-[4/3] bg-gray-100 rounded-2xl' />
        <div className='aspect-[4/3] bg-gray-100 rounded-2xl' />
      </div>
    </main>
  )
}
