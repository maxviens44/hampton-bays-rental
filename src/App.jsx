/* ────────────────────────────────────────────────────────── *
 * Availability Calendar
 * - uses /availability.json  { "booked": ["YYYY-MM-DD", ...] }
 * - uses /pricing.json       { "currency":"USD","default":1000,"prices":{ "YYYY-MM-DD":2400, ... } }
 * ────────────────────────────────────────────────────────── */
function AvailabilityCalendar({ months = 12 }) {
  const [booked, setBooked] = useState(() => new Set())
  const [loaded, setLoaded] = useState(false)

  // pricing
  const [currency, setCurrency] = useState("USD")
  const [defaultPrice, setDefaultPrice] = useState(undefined)
  const [overrides, setOverrides] = useState({})

  // simple floating tooltip
  const [tip, setTip] = useState({ open: false, text: "", x: 0, y: 0 })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [availRes, priceRes] = await Promise.all([
          fetch(`/availability.json?v=${Date.now()}`),
          fetch(`/pricing.json?v=${Date.now()}`)
        ])

        // availability
        if (availRes.ok) {
          const a = await availRes.json()
          const dates = Array.isArray(a?.booked) ? a.booked : []
          if (!cancelled) setBooked(new Set(dates))
        } else if (!cancelled) {
          setBooked(new Set())
        }

        // pricing
        if (priceRes.ok) {
          const p = await priceRes.json()
          const cur = typeof p?.currency === "string" ? p.currency : "USD"
          const def = typeof p?.default === "number" ? p.default : undefined
          const map = p?.prices && typeof p.prices === "object" ? p.prices : {}
          if (!cancelled) {
            setCurrency(cur)
            setDefaultPrice(def)
            setOverrides(map)
          }
        } else if (!cancelled) {
          setCurrency("USD")
          setDefaultPrice(undefined)
          setOverrides({})
        }
      } catch {
        if (!cancelled) {
          setBooked(new Set())
          setCurrency("USD")
          setDefaultPrice(undefined)
          setOverrides({})
        }
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const fmt = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency })
    } catch {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })
    }
  }, [currency])

  const priceFor = useCallback((iso) => {
    const v = overrides?.[iso]
    if (typeof v === "number") return v
    if (typeof defaultPrice === "number") return defaultPrice
    return undefined
  }, [overrides, defaultPrice])

  const showTip = useCallback((e, text) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTip({ open: true, text, x: r.left + r.width / 2, y: r.top - 8 })
  }, [])
  const hideTip = useCallback(() => setTip({ open: false, text: "", x: 0, y: 0 }), [])

  const today = new Date()
  const startYear = today.getFullYear()
  const startMonth = today.getMonth()

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const startOfMonthWeekday = (y, m) => new Date(y, m, 1).getDay()
  const isPast = (y, m, d) => {
    const date = new Date(y, m, d, 23, 59, 59, 999)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  const Month = ({ year, month }) => {
    const name = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" })
    const firstDow = startOfMonthWeekday(year, month)
    const total = daysInMonth(year, month)
    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(d)

    return (
      <div className="rounded-xl border bg-white p-2 shadow-sm text-sm">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm">{name}</h4>
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="py-0.5 text-neutral-600">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 text-xs">
          {cells.map((d, idx) => {
            if (d === null) return <div key={`b-${idx}`} />
            const iso = toISO(year, month, d)
            const isBookedDay = booked.has(iso)
            const past = isPast(year, month, d)
            const price = priceFor(iso)

            const base = "w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded border text-xs select-none relative"
            const stateCls = isBookedDay ? "bg-neutral-200 line-through text-neutral-500 cursor-not-allowed" : "bg-white cursor-default"
            const pastCls = past ? "opacity-40" : ""

            const label = isBookedDay
              ? "Booked"
              : typeof price === "number"
              ? `Nightly price ${fmt.format(price)}`
              : "Available"

            return (
              <div
                key={iso}
                className={`${base} ${stateCls} ${pastCls}`}
                onMouseEnter={(e) => showTip(e, label)}
                onMouseLeave={hideTip}
                title={label}
                aria-label={`${name} ${d}${isBookedDay ? " booked" : typeof price === "number" ? ` price ${fmt.format(price)}` : ""}`}
              >
                {d}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const monthsList = Array.from({ length: months }, (_, i) => {
    const m = startMonth + i
    const y = startYear + Math.floor(m / 12)
    const mm = m % 12
    return { year: y, month: mm, key: `${y}-${mm}` }
  })

  return (
    <section className="mt-8 md:mt-10" aria-labelledby="availability-title">
      <div className="flex items-center justify-between mb-2">
        <h3 id="availability-title" className="text-base md:text-lg font-semibold">Availability</h3>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-white" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm border bg-neutral-200" /> Booked
          </span>
        </div>
      </div>

      {!loaded && <div className="text-xs text-neutral-500 mb-2">Loading calendar…</div>}
      <p className="text-[11px] text-neutral-500 mb-2">Hover a date to see the nightly price or status</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3">
        {monthsList.map(({ year, month, key }) => (
          <Month key={key} year={year} month={month} />
        ))}
      </div>

      {tip.open && (
        <div
          style={{
            position: "fixed",
            left: tip.x,
            top: tip.y,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 9999
          }}
          className="px-2 py-1 text-[11px] rounded bg-black text-white shadow"
          role="tooltip"
        >
          {tip.text}
        </div>
      )}
    </section>
  )
}
