import { STATE_COPY } from '../hooks/useTelemetry'

export default function RobotHero({ state }) {
  return (
    <div className={`hero hero-${state}`}>
      <div className="hero-stage">
        <div className="orbit o1" /><div className="orbit o2" />
        <svg viewBox="0 0 200 240" className="bot" aria-label="Nexus robot">
          <rect x="62" y="22" width="76" height="62" rx="24" className="b-shell" />
          <rect x="72" y="34" width="56" height="38" rx="16" className="b-face" />
          <circle cx="88" cy="50" r="5" className="b-eye" /><circle cx="112" cy="50" r="5" className="b-eye" />
          <path d="M91 62q9 6 18 0" className="b-smile" />
          <rect x="52" y="92" width="96" height="70" rx="26" className="b-shell" />
          <rect x="70" y="104" width="60" height="46" rx="12" className="b-face" />
          <text x="100" y="132" textAnchor="middle" className="b-label">NEXUS</text>
          <rect x="30" y="100" width="18" height="56" rx="9" className="b-shell" />
          <rect x="152" y="100" width="18" height="56" rx="9" className="b-shell" />
          <rect x="44" y="172" width="112" height="30" rx="15" className="b-base" />
          <circle cx="62" cy="212" r="15" className="b-wheel" /><circle cx="138" cy="212" r="15" className="b-wheel" />
        </svg>
        <div className="floor" />
      </div>
      <div className="hero-caption"><i />{STATE_COPY[state]}</div>
    </div>
  )
}
