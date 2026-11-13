export const Panel = ({ title, icon: Icon, action, children, className = '' }) => (
  <section className={`panel ${className}`}>
    {title && (
      <header className="panel-head">
        <h3>{Icon && <Icon size={16} />}{title}</h3>
        {action}
      </header>
    )}
    {children}
  </section>
)

export const Badge = ({ tone = 'neutral', children }) => (
  <span className={`badge badge-${tone}`}><i />{children}</span>
)

export function Ring({ value, size = 132, tone = 'accent', label, sub }) {
  const r = 52, c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} className="ring-track" />
        <circle cx="60" cy="60" r={r} className={`ring-bar ring-${tone}`}
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div><strong>{label}</strong><span>{sub}</span></div>
    </div>
  )
}

export function Sparkline({ data, limit, max = 700, height = 80 }) {
  const w = 300
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - (v / max) * height}`)
  const ly = height - (limit / max) * height
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="spark" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity=".35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts.join(' ')} ${w},${height}`} fill="url(#sg)" />
      <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <line x1="0" x2={w} y1={ly} y2={ly} stroke="var(--critical)" strokeDasharray="4 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export const time = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
