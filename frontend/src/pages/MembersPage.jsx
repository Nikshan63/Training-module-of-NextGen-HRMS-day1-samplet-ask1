import { useState, useEffect } from 'react'
import { projectsAPI, membersAPI } from '../api/axios'
import { Modal, Field, Select, PageLoader } from '../components/ui'
import { UserPlus, Trash2, Crown, Shield, Eye, User } from 'lucide-react'

const ROLE_ICONS = { OWNER: Crown, MANAGER: Shield, MEMBER: User, VIEWER: Eye }
const ROLE_COLORS = { OWNER: '#f59e0b', MANAGER: '#60a5fa', MEMBER: '#a3a3a3', VIEWER: '#4ade80' }
const ROLE_OPTIONS = [
  { value: 'MANAGER', label: 'Manager' },
  { value: 'MEMBER',  label: 'Member'  },
  { value: 'VIEWER',  label: 'Viewer'  },
]

export default function MembersPage() {
  const [projects, setProjects]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [members, setMembers]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState({ email: '', role: 'MEMBER' })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    projectsAPI.getAll().then(r => {
      setProjects(r.data)
      if (r.data.length > 0) { setSelected(r.data[0]); loadMembers(r.data[0].id) }
      else setLoading(false)
    })
  }, [])

  const loadMembers = projectId => {
    setLoading(true)
    membersAPI.getByProject(projectId)
      .then(r => setMembers(r.data))
      .finally(() => setLoading(false))
  }

  const selectProject = p => { setSelected(p); loadMembers(p.id) }

  const handleAdd = async () => {
    if (!form.email) return
    setSaving(true); setError('')
    try {
      await membersAPI.add(selected.id, form)
      setModal(false); setForm({ email: '', role: 'MEMBER' })
      loadMembers(selected.id)
    } catch (e) { setError(e.response?.data?.message || 'Could not add member') }
    finally { setSaving(false) }
  }

  const handleRemove = async userId => {
    if (!window.confirm('Remove this member?')) return
    try { await membersAPI.remove(selected.id, userId); loadMembers(selected.id) }
    catch { alert('Could not remove member') }
  }

  const handleRoleChange = async (userId, role) => {
    try { await membersAPI.updateRole(selected.id, userId, role); loadMembers(selected.id) }
    catch { alert('Could not update role') }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
      {/* Project sidebar */}
      <div className="card anim-fade-up" style={{ padding: 16 }}>
        <p style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
          SELECT PROJECT
        </p>
        {projects.map(p => (
          <button key={p.id} onClick={() => selectProject(p)}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
              background: selected?.id === p.id ? 'rgba(245,158,11,0.08)' : 'transparent',
              border: selected?.id === p.id ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
              color: selected?.id === p.id ? 'var(--amber)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 4,
            }}>
            {p.title}
          </button>
        ))}
      </div>

      {/* Members panel */}
      <div>
        <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 12, fontFamily: 'IBM Plex Mono', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {selected?.title || 'Members'}
            </p>
            <h2 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, margin: 0 }}>Team Members</h2>
          </div>
          {selected && (
            <button className="btn-primary" onClick={() => setModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserPlus size={15} /> Add Member
            </button>
          )}
        </div>

        {loading ? <PageLoader /> : (
          <div className="anim-fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                No members yet
              </div>
            ) : members.map(m => {
              const Icon = ROLE_ICONS[m.role] || User
              const color = ROLE_COLORS[m.role] || '#a3a3a3'
              return (
                <div key={m.id} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color }}>{m.user.name[0].toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{m.user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{m.user.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color, fontSize: 12, fontWeight: 500 }}>
                    <Icon size={13} />{m.role}
                  </div>
                  {m.role !== 'OWNER' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select value={m.role} onChange={e => handleRoleChange(m.user.id, e.target.value)}
                        className="input" style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}>
                        {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--base-700)' }}>{o.label}</option>)}
                      </select>
                      <button className="btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleRemove(m.user.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modal && (
        <Modal title="Add Team Member" onClose={() => { setModal(false); setError('') }}>
          {error && <div style={{ marginBottom: 14, color: '#f87171', fontSize: 13 }}>{error}</div>}
          <Field label="Email Address">
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input" placeholder="teammate@company.com" />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} options={ROLE_OPTIONS} />
          </Field>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-ghost" onClick={() => { setModal(false); setError('') }}>Cancel</button>
            <button className="btn-primary" onClick={handleAdd} disabled={saving || !form.email}>
              {saving ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
