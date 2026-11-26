import { useState } from 'react'
import { ArrowRight, LockKeyhole, Eye, EyeOff, ShieldCheck, Fingerprint } from 'lucide-react'

export default function Auth({ onLogin }) {
  const [nexId, setNexId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!nexId.trim() || !password.trim()) {
      setError('Please enter your NEX ID and password.')
      return
    }
    // Frontend demonstration only. Connect this handler to your authentication API for real accounts.
    onLogin()
  }

  return (
    <main className="auth-screen">
      <section className="auth-wrap">
        <div className="auth-card">
          <div className="auth-brand auth-brand-inside">
            <div className="auth-logo">NEXUS</div>
             <p>SAFETY SENSING & SECURITY</p>
          </div>

          <div className="auth-card-heading">
            <span className="auth-mark"><ShieldCheck size={20} /></span>
            <div>
              <h1>Welcome Back</h1>
              <p>Login to your NEXUS account</p>
            </div>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label className="auth-field">
              
              <span className="auth-input-wrap"><Fingerprint size={17} /><input value={nexId} onChange={e => setNexId(e.target.value)} placeholder="Enter your NEX ID" autoComplete="username" /></span>
            </label>
            <label className="auth-field">
              
              <span className="auth-input-wrap"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit">LOGIN <ArrowRight size={17} /></button>
          </form>
        </div>
        <p className="auth-foot">NEXUS CONTROL SYSTEM <span>•</span> DASHBOARD ACCESS</p>
      </section>
    </main>
  )
}
