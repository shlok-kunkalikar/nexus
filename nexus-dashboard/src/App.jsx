
import { useEffect, useState } from 'react'

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

  // AUTHENTICATION: verify the saved token with the backend on page load
  const [authenticated, setAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const token = localStorage.getItem('nexus-token')
    if (!token) {
      setAuthChecking(false)
      return
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.message || 'Session expired')
        setCurrentUser(data.user)
        setAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem('nexus-token')
        setCurrentUser(null)
        setAuthenticated(false)
      })
      .finally(() => setAuthChecking(false))
  }, [])

  // LOGIN FUNCTION
  const login = (data) => {
    localStorage.setItem('nexus-token', data.token)
    setCurrentUser(data.user)
    setAuthenticated(true)
  }

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('nexus-token')
    setCurrentUser(null)
    setAuthenticated(false)
    setPage('dashboard')
  }

  // ROBOT TELEMETRY
  const d = useTelemetry()
  const { t } = d

  // ALERT COUNT
  const alerts = d.events.filter(
    (e) => e.level === 'critical'
  ).length

  // SYSTEM STATUS
  const secure = t.state !== 'alert'

  // PAGE TITLE
  const title =
    NAV.find((n) => n[0] === page)?.[1] || 'Dashboard'

  // CHECKING OR SHOWING LOGIN PAGE
  if (authChecking) {
    return <div className="auth-screen"><p>Checking NEXUS session...</p></div>
  }

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
          {NAV.map(([id, label, Icon]) => (

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
            <p>Welcome back, {currentUser?.name || currentUser?.nexId || 'User'}</p>
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
              <strong>{currentUser?.nexId || 'NEXUS User'}</strong>
              <span>{currentUser?.role || 'operator'}</span>
            </div>

            <div className="avatar">
              {(currentUser?.nexId || 'NX').slice(0, 2).toUpperCase()}
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

          {page === 'dashboard' && (
            <Dashboard
              t={t}
              setMode={d.setMode}
            />
          )}

          {page === 'warning' && (
            <Warnings {...d} />
          )}

          {page === 'camera' && (
            <CameraPage
              state={t.state}
            />
          )}

          {page === 'attendance' && (
            <Attendance {...d} />
          )}

          {page === 'about' && (
            <About />
          )}

        </div>

      </main>

    </div>
  )
}
