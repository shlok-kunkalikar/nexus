
import { useState, useEffect } from 'react'

import {
  LayoutDashboard,
  TriangleAlert,
  Camera,
  UserCheck,
  Info,
  Bell,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'

import { useTelemetry } from './hooks/useTelemetry'

import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import { Warnings } from './pages/warning'
import { CameraPage } from './pages/Camera'
import { Attendance } from './pages/Attendance'
import { About } from './pages/About'

// NAVIGATION ITEMS
const NAV = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['warning', 'Warning', TriangleAlert],
  ['camera', 'Camera', Camera],
  ['attendance', 'Attendance', UserCheck],
  ['about', 'About us', Info],
]

export default function App() {

  // CURRENT PAGE
  const [page, setPage] = useState('dashboard')

  // AUTHENTICATION
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem('nexus-auth') === 'true'
  )

  // LOGIN FUNCTION
  const login = () => {
    localStorage.setItem('nexus-auth', 'true')
    setAuthenticated(true)
  }

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('nexus-auth')
    setAuthenticated(false)
    setPage('dashboard')
  }

  // ROBOT TELEMETRY
  const d = useTelemetry()
  const { t } = d

  // ATTENDANCE ACCESS CONTROL
  // Attendance is available only in Office mode
  useEffect(() => {
    if (t.mode !== 'office' && page === 'attendance') {
      setPage('dashboard')
    }
  }, [t.mode, page])

  // ALERT COUNT
  const alerts = d.events.filter(
    (e) => e.level === 'critical'
  ).length

  // SYSTEM STATUS
  const secure = t.state !== 'alert'

  // PAGE TITLE
  const title =
    NAV.find((n) => n[0] === page)?.[1] || 'Dashboard'

  // SHOW LOGIN PAGE IF NOT AUTHENTICATED
  if (!authenticated) {
    return <Auth onLogin={login} />
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="side">

        <div className="brand">
          NEXUS
        </div>

        {/* NAVIGATION */}
        <nav>
          {NAV
            .filter(([id]) =>
              id !== 'attendance' || t.mode === 'office'
            )
            .map(([id, label, Icon]) => (

              <button
                key={id}
                className={page === id ? 'on' : ''}
                onClick={() => setPage(id)}
                aria-current={
                  page === id ? 'page' : undefined
                }
              >

                <Icon size={18} />

                {label}

                {id === 'warning' && !secure && (
                  <span className="dot-alert" />
                )}

              </button>

            ))}
        </nav>

        {/* SYSTEM SECURITY STATUS */}
        <div className={`secure ${secure ? '' : 'bad'}`}>

          {secure ? (
            <ShieldCheck size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}

          <div>

            <strong>
              {secure ? 'System secure' : 'Alert active'}
            </strong>

            <span>
              {secure
                ? 'All systems operating normally'
                : 'Check the warnings page'}
            </span>

          </div>

        </div>

        <small className="ver">
          v 26.04.06
        </small>

      </aside>

      {/* MAIN CONTENT */}
      <main>

        {/* TOP HEADER */}
        <header className="top">

          <div>
            <h1>{title}</h1>
            <p>Welcome back, User-1</p>
          </div>

          <div className="who">

            {/* NOTIFICATION BUTTON */}
            <button
              className="icon-btn"
              aria-label={`${alerts} critical alerts`}
              onClick={() => setPage('warning')}
            >

              <Bell size={18} />

              {alerts > 0 && <b>{alerts}</b>}

            </button>

            {/* USER DETAILS */}
            <div className="user">
              <strong>User-1</strong>
              <span>Administrator</span>
            </div>

            <div className="avatar">
              U1
            </div>

            {/* LOGOUT */}
            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <div className="content">

          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <Dashboard
              t={t}
              setMode={d.setMode}
            />
          )}

          {/* WARNINGS */}
          {page === 'warning' && (
            <Warnings {...d} />
          )}

          {/* CAMERA */}
          {page === 'camera' && (
            <CameraPage
              state={t.state}
            />
          )}

          {/* ATTENDANCE - OFFICE MODE ONLY */}
          {page === 'attendance' && t.mode === 'office' && (
            <Attendance {...d} />
          )}

          {/* ABOUT */}
          {page === 'about' && (
            <About />
          )}

        </div>

      </main>

    </div>
  )
}
