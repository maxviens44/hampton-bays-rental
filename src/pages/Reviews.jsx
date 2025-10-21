import { Helmet } from 'react-helmet-async'
import Header from '../shared/Header.jsx'
import { useEffect, useState } from 'react'

function StarRating({ value = 5 }) {
  return (
    <span aria-label={`${value} stars`} className='text-yellow-500'>
      {'★'.repeat(value)}{'☆'.repeat(Math.max(0, 5 - value))}
    </span>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/reviews.json?v=${Date.now()}`)
        if (!res.ok) throw new Error('Failed to load reviews.json')
        const data = await res.json()
        const list = Array.isArray(data?.reviews) ? data.reviews : []
        if (!cancelled) setReviews(list)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load reviews')
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Header />
      <main className='px-4 md:px-10 py-8 md:py-12'>
        <Helmet>
          <title>Guest Reviews • Hampton Bays Rental</title>
          <meta name='description' content='Read guest reviews for our Hampton Bays luxury rental' />
        </Helmet>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-xl md:text-2xl font-semibold mb-4'>Guest Reviews</h2>

          {!loaded && <p className='text-sm text-neutral-600 mb-6'>Loading reviews…</p>}
          {error && <p className='text-sm text-red-600 mb-6'>{error}</p>}
          {loaded && !error && (
            reviews.length ? (
              <ul className='space-y-4 mb-8'>
                {reviews.map((r, idx) => (
                  <li key={idx} className='rounded-2xl border p-4 bg-white shadow-sm'>
                    <div className='flex items-center justify-between mb-1'>
                      <p className='font-medium'>{r.name || 'Guest'}</p>
                      <StarRating value={Number(r.stars) || 5} />
                    </div>
                    {(r.from || r.to) && (
                      <p className='text-xs text-neutral-600 mb-2'>
                        Stayed {r.from ? `from ${r.from}` : ''}{r.from && r.to ? ' ' : ''}{r.to ? `to ${r.to}` : ''}
                      </p>
                    )}
                    <p className='text-sm text-neutral-800 whitespace-pre-line'>{r.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-neutral-600 mb-8'>No reviews yet. Be the first to share your stay.</p>
            )
          )}

          <h3 className='text-lg font-semibold mb-3'>Share Your Stay</h3>
          <p className='text-sm text-neutral-700 mb-4'>Submit your review below.</p>

          <form
            name='review-pending'
            method='POST'
            data-netlify='true'
            netlify-honeypot='bot-field'
            action='/thanks.html'
            className='space-y-4'
          >
            <input type='hidden' name='form-name' value='review-pending' />
            <p className='hidden'>
              <label>Don’t fill this out if you’re human <input name='bot-field' /></label>
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <input type='text' name='Name' placeholder='Your Name' required className='border rounded-lg px-3 py-3 w-full' />
              <select name='Stars' required className='border rounded-lg px-3 py-3 w-full'>
                <option value='' disabled>Rating</option>
                <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
              </select>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs text-neutral-600 mb-1'>Stayed From</label>
                <input type='date' name='Stayed From' className='border rounded-lg px-3 py-3 w-full' required />
              </div>
              <div>
                <label className='block text-xs text-neutral-600 mb-1'>Stayed To</label>
                <input type='date' name='Stayed To' className='border rounded-lg px-3 py-3 w-full' required />
              </div>
            </div>

            <textarea name='Comment' placeholder='Tell us about your stay' rows='5' required className='border rounded-lg px-3 py-3 w-full' />
            <input type='hidden' name='Status' value='Pending' />

            <button type='submit' className='rounded-2xl border px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition'>
              Submit Review
            </button>
          </form>
        </div>
      </main>
      <footer className='px-4 md:px-10 py-8 border-t'>
        <div className='max-w-7xl mx-auto text-sm text-neutral-600'>© {new Date().getFullYear()} Staythehamptons.com</div>
      </footer>
    </>
  )
}
