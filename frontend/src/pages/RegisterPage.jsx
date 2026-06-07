import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, User, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--base-950)', padding: 20,
    }} className="grid-bg">
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--amber)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Zap size={24} color="#000" fill="#000" />
          </div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>
            Get Started
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Create your free workspace</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13,
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <form onSubmit={submit}>
            {[
              { name: 'name',     label: 'Full Name', type: 'text',     icon: User,  placeholder: 'John Doe'          },
              { name: 'email',    label: 'Email',     type: 'email',    icon: Mail,  placeholder: 'you@company.com'   },
              { name: 'password', label: 'Password',  type: 'password', icon: Lock,  placeholder: '••••••••'          },
            ].map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <Icon size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input name={name} type={type} value={form[name]} onChange={handle}
                    className="input" style={{ paddingLeft: 36 }} placeholder={placeholder} required />
                </div>
              </div>
            ))}
            <div style={{ height: 8 }} />
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: 15 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
