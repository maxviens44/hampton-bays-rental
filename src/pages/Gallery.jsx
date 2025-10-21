import { Helmet } from 'react-helmet-async'
import Header from '../shared/Header.jsx'
import images from '../data/images.js'
import { useState, useCallback, useEffect } from 'react'

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const openAt = useCallback(i => { setIndex(i); setLightboxOpen(true) }, [])
  const close = useCallback(() => setLightboxOpen(false), [])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightboxOpen, close, next, prev])

  return (
    <>
      <Header />
      <main className='max-w-7xl mx-auto p-6'>
        <Helmet>
          <title>Gallery • Hampton Bays Rental</title>
          <meta name='description' content='Photos of the home, pool and local attractions' />
        </Helmet>
        <h1 className='text-3xl font-bold mb-4'>Gallery</h1>
        <p className='text-sm text-neutral-600 mb-6'>Tap any photo to view it full screen</p>

        <div className='grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'>
          {images.map((img, idx) => (
            <button
              key={img.file}
              onClick={() => openAt(idx)}
              className='group relative focus:outline-none'
              aria-label={`Open ${img.label}`}
            >
              <img
                src={`/images/${img.file}`}
                alt={img.label}
                loading={idx < 6 ? 'eager' : 'lazy'}
                className='w-full h-56 sm:h-64 md:h-72 object-cover rounded-2xl shadow-sm transform transition-transform duration-200 group-hover:scale-105'
              />
              <span className='absolute bottom-2 left-2 text-[11px] sm:text-xs bg-black/50 text-white px-2 py-0.5 rounded'>
                {img.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      {lightboxOpen && (
        <div className='fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-2 md:p-4' role='dialog' aria-modal='true' onClick={close}>
          <div className='relative w-full max-w-5xl' onClick={e => e.stopPropagation()}>
            <img src={`/images/${images[index].file}`} alt={images[index].label} className='w-full h-[70vh] md:h-[82vh] object-contain rounded-lg' />
            <div className='absolute inset-x-0 -bottom-12 md:bottom-auto md:top-3 flex justify-center md:justify-end gap-2'>
              <button onClick={prev} type='button' className='rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow'>Prev</button>
              <button onClick={next} type='button' className='rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow'>Next</button>
              <button onClick={close} type='button' className='rounded-full bg-white/90 hover:bg-white px-4 py-3 text-base shadow'>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className='px-4 md:px-10 py-8 border-t'>
        <div className='max-w-7xl mx-auto text-sm text-neutral-600'>© {new Date().getFullYear()} Staythehamptons.com</div>
      </footer>
    </>
  )
}
