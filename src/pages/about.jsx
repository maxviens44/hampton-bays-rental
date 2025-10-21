import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <main className='max-w-3xl mx-auto p-6'>
      <Helmet>
        <title>About • Hampton Bays Rental</title>
        <meta name='description' content='About the property and hosts' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>About</h1>
      <p>Short blurb about the home, renovation highlights and what makes it special</p>
    </main>
  )
}
