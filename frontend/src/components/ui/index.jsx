import { X } from 'lucide-react'

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} className="anim-fade-in">
      <div className="card" style={{ width, maxWidth: '100%', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'var(--base-700)', border: 'none', borderRadius: 6,
            color: 'var(--text-secondary)', cursor: 'pointer', padding: 6,
            display: 'flex', alignItems: 'center',
          }}>
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────
const badgeMap = {
  TODO:        'badge-todo',
  IN_PROGRESS: 'badge-progress',
  IN_REVIEW:   'badge-review',
  DONE:        'badge-done',
  ACTIVE:      'badge-active',
  ON_HOLD:     'badge-hold',
  COMPLETED:   'badge-completed',
  ARCHIVED:    'badge-archived',
}

export function Badge({ value }) {
  const cls = badgeMap[value] || 'badge-todo'
  return <span className={`badge ${cls}`}>{value?.replace('_', ' ')}</span>
}

// ── Priority dot ──────────────────────────────────────────────
export function PriorityDot({ value }) {
  const colors = { LOW: '#4ade80', MEDIUM: '#fbbf24', HIGH: '#fb923c', CRITICAL: '#f87171' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors[value] || '#94a3b8', display: 'inline-block' }} />
      <span style={{ color: colors[value] || '#94a3b8', fontFamily: 'IBM Plex Mono', fontSize: 11 }}>{value}</span>
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid var(--base-600)`,
      borderTopColor: 'var(--amber)',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

// ── Page loader ───────────────────────────────────────────────
export function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Spinner size={36} />
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────
export function Empty({ icon, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, marginBottom: 20 }}>{message}</div>
      {action}
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────────
export function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{error}</div>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ value, onChange, options, ...props }) {
  return (
    <select value={value} onChange={onChange} className="input" {...props} style={{ cursor: 'pointer' }}>
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'var(--base-700)' }}>{o.label}</option>
      ))}
    </select>
  )
}

// Add spin keyframe
const style = document.createElement('style')
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
document.head.appendChild(style)
