
import { useState } from 'react'
import {
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  Fingerprint
} from 'lucide-react'

import logo from '/imgs/logo.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Auth({ onLogin }) {

  const [nexId, setNexId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // LOGIN FUNCTION
  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!nexId.trim() || !password) {
      setError('Please enter your NEX ID and password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nexId: nexId.trim(),
            password
          })
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.message || 'Incorrect NEX ID or password.'
        )
      }

      onLogin(data)

    } catch (err) {
      setError(err.message || 'Cannot connect to NEXUS server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-screen">

      <section className="auth-wrap">

        <div className="auth-card">

          {/* NEXUS LOGO */}
          <div className="auth-brand auth-brand-inside">
           

            <img
              src={logo}
              alt="NEXUS Logo"
              className="auth-logo-image"
            />

            <p> Bridging Safety, Sensing & Security</p>

          </div>

    

          {/* LOGIN FORM */}
          <form onSubmit={submit} className="auth-form">

            {/* ERROR MESSAGE ABOVE NEX ID */}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            {/* NEX ID */}
            <label className="auth-field">

              <span>NEX ID</span>

              <span className="auth-input-wrap">

                <Fingerprint size={17} />

                <input
                  type="text"
                  value={nexId}
                  onChange={e => setNexId(e.target.value)}
                  placeholder="Enter your NEX ID"
                  autoComplete="username"
                  required
                />

              </span>

            </label>

            {/* PASSWORD */}
            <label className="auth-field">

              <span>Password</span>

              <span className="auth-input-wrap">

                <LockKeyhole size={17} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                {/* SHOW / HIDE PASSWORD */}
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword
                    ? <EyeOff size={17} />
                    : <Eye size={17} />
                  }
                </button>

              </span>

            </label>

            {/* LOGIN BUTTON */}
            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >

              {loading ? 'VERIFYING...' : 'LOGIN'}

              {!loading && <ArrowRight size={17} />}

            </button>

          </form>

        </div>

        <p className="auth-foot">
          NEXUS CONTROL SYSTEM
          <span>•</span>
          DASHBOARD ACCESS
        </p>

      </section>

    </main>
  )
}
