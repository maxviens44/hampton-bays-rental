import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState('idle')

  function submit(e) {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <main className='max-w-md mx-auto p-6'>
      <Helmet>
        <title>Contact • Hampton Bays Rental</title>
        <meta name='description' content='Contact the host for questions and bookings' />
      </Helmet>
      <h1 className='text-3xl font-bold mb-4'>Contact</h1>
      <form onSubmit={submit} className='space-y-3'>
        <input className='w-full border rounded-xl p-3' placeholder='Name' required />
        <input className='w-full border rounded-xl p-3' placeholder='Email' type='email' required />
        <textarea className='w-full border rounded-xl p-3' rows='5' placeholder='Message' required />
        <button className='px-4 py-2 rounded-2xl shadow bg-black text-white'>Send</button>
      </form>
      {status === 'sent' && <p className='mt-4 text-green-700'>Thanks. We will reply shortly.</p>}
    </main>
  )
}
