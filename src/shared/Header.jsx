import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  function Anchor({ hash, children, className = "" }) {
    const onClick = (e) => {
      if (location.pathname === "/") {
        e.preventDefault()
        const id = hash.replace("#", "")
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    return (
      <Link to={`/${hash}`} onClick={onClick} className={`hover:underline ${className}`}>
        {children}
      </Link>
    )
  }

  const base = "px-2 py-1"
  const mobileItem = "px-2 py-2 rounded-lg hover:bg-neutral-100"

  return (
    <header id="top" className="relative px-4 md:px-10 py-3 md:py-5 border-b sticky top-0 bg-white md:bg-white/90 backdrop-blur md:backdrop-blur z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link to="/" className="text-base sm:text-lg md:text-2xl font-semibold tracking-tight">
          Hampton Bays
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Anchor hash="#about" className={base}>About</Anchor>
          <Anchor hash="#gallery" className={base}>Gallery</Anchor>
          <NavLink to="/reviews" className={base}>Reviews</NavLink>
          <NavLink to="/us-open-2026" className={base}>US Open 2026</NavLink>
          <NavLink to="/bookings" className={base}>Bookings</NavLink>
          <NavLink to="/contact" className={base}>Contact</NavLink>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2 bg-white shadow-sm"
          onClick={() => setOpen(v => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-lg">
          <nav className="px-4 py-3 grid gap-1 text-base">
            <Anchor hash="#about" className={mobileItem}>About</Anchor>
            <Anchor hash="#gallery" className={mobileItem}>Gallery</Anchor>
            <NavLink to="/reviews" className={mobileItem}>Reviews</NavLink>
            <NavLink to="/us-open-2026" className={mobileItem}>US Open 2026</NavLink>
            <NavLink to="/bookings" className={mobileItem}>Bookings</NavLink>
            <NavLink to="/contact" className={mobileItem}>Contact</NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}
