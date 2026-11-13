import { useState } from 'react'
import { LayoutDashboard, TriangleAlert, Camera, UserCheck, Info, Bell, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTelemetry } from './hooks/useTelemetry'
import Dashboard from './pages/Dashboard'
import { Warnings, CameraPage, Attendance, About } from './pages/Pages'

const NAV = [
  ['dashboard', 'Dashboard', LayoutDashboard], ['warning', 'Warning', TriangleAlert],
  ['camera', 'Camera', Camera], ['attendance', 'Attendance', UserCheck], ['about', 'About us', Info],
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const d = useTelemetry()
  const { t } = d
  const alerts = d.events.filter((e) => e.level === 'critical').length
  const secure = t.state !== 'alert'
  const title = NAV.find((n) => n[0] === page)[1]

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">NEXUS</div>
        <nav>{NAV.map(([id, label, Icon]) => (
          <button key={id} className={page === id ? 'on' : ''} onClick={() => setPage(id)} aria-current={page === id ? 'page' : undefined}>
            <Icon size={18} />{label}
            {id === 'warning' && !secure && <span className="dot-alert" />}
          </button>))}
        </nav>
        <div className={`secure ${secure ? '' : 'bad'}`}>
          {secure ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
          <div><strong>{secure ? 'System secure' : 'Alert active'}</strong>
            <span>{secure ? 'All systems operating normally' : 'Check the warnings page'}</span></div>
        </div>
        <small className="ver">v 26.04.06</small>
      </aside>

      <main>
        <header className="top">
          <div><h1>{title}</h1><p>Welcome back, User-1</p></div>
          <div className="who">
            <button className="icon-btn" aria-label={`${alerts} critical alerts`} onClick={() => setPage('warning')}>
              <Bell size={18} />{alerts > 0 && <b>{alerts}</b>}
            </button>
            <div className="user"><strong>User-1</strong><span>Administrator</span></div>
            <div className="avatar">U1</div>
          </div>
        </header>
        <div className="content">
          {page === 'dashboard' && <Dashboard t={t} setMode={d.setMode} />}
          {page === 'warning' && <Warnings {...d} />}
          {page === 'camera' && <CameraPage state={t.state} />}
          {page === 'attendance' && <Attendance {...d} />}
          {page === 'about' && <About />}
        </div>
      </main>
    </div>
  )
}
