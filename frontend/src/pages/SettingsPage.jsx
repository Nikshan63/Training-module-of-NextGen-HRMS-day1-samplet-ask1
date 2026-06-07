import { useState, useEffect } from 'react'
import { projectsAPI, configAPI } from '../api/axios'
import { Field, Select, PageLoader } from '../components/ui'
import { Save, Settings } from 'lucide-react'

const VISIBILITY_OPTIONS = [
  { value: 'PRIVATE',   label: 'Private — Only members can see' },
  { value: 'TEAM_ONLY', label: 'Team Only — Org members can see' },
  { value: 'PUBLIC',    label: 'Public — Anyone can view' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' },
]

function Toggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{description}</div>
      </div>
      <div onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', flexShrink: 0,
        background: checked ? 'var(--amber)' : 'var(--base-600)',
        transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [projects, setProjects]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [config, setConfig]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  useEffect(() => {
    projectsAPI.getAll().then(r => {
      setProjects(r.data)
      if (r.data.length > 0) { setSelected(r.data[0]); loadConfig(r.data[0].id) }
      else setLoading(false)
    })
  }, [])

  const loadConfig = id => {
    setLoading(true)
    configAPI.get(id)
      .then(r => setConfig(r.data))
      .catch(() => setConfig({
        allowMemberInvite: true, requireTaskApproval: false,
        notificationsEnabled: true, visibility: 'PRIVATE',
        defaultTaskPriority: 'MEDIUM', customLabels: '',
      }))
      .finally(() => setLoading(false))
  }

  const selectProject = p => { setSelected(p); loadConfig(p.id) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await configAPI.update(selected.id, config)
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch { alert('Failed to save settings') }
    finally { setSaving(false) }
  }

  const set = (key, val) => setConfig(c => ({ ...c, [key]: val }))

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

      {/* Config panel */}
      <div>
        <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 12, fontFamily: 'IBM Plex Mono', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {selected?.title || 'Project'}
            </p>
            <h2 style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, margin: 0 }}>Configuration</h2>
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !config}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={15} />
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>

        {loading || !config ? <PageLoader /> : (
          <div className="anim-fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Visibility */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>🌐 Visibility</h3>
              <Field label="Project Visibility">
                <Select value={config.visibility} onChange={e => set('visibility', e.target.value)} options={VISIBILITY_OPTIONS} />
              </Field>
              <Field label="Default Task Priority">
                <Select value={config.defaultTaskPriority} onChange={e => set('defaultTaskPriority', e.target.value)} options={PRIORITY_OPTIONS} />
              </Field>
            </div>

            {/* Permissions */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>🔐 Permissions</h3>
              <Toggle
                checked={config.allowMemberInvite}
                onChange={() => set('allowMemberInvite', !config.allowMemberInvite)}
                label="Allow Members to Invite"
                description="Members can invite new people to this project" />
              <Toggle
                checked={config.requireTaskApproval}
                onChange={() => set('requireTaskApproval', !config.requireTaskApproval)}
                label="Require Task Approval"
                description="Tasks must be approved by a manager before marked done" />
              <Toggle
                checked={config.notificationsEnabled}
                onChange={() => set('notificationsEnabled', !config.notificationsEnabled)}
                label="Email Notifications"
                description="Send email alerts for task assignments and updates" />
            </div>

            {/* Custom labels */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>🏷️ Custom Labels</h3>
              <Field label="Labels (comma-separated)">
                <input value={config.customLabels || ''} onChange={e => set('customLabels', e.target.value)}
                  className="input" placeholder="bug, feature, enhancement, hotfix" />
              </Field>
              {config.customLabels && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {config.customLabels.split(',').map(l => l.trim()).filter(Boolean).map(label => (
                    <span key={label} style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 12,
                      background: 'rgba(245,158,11,0.12)', color: 'var(--amber)',
                      border: '1px solid rgba(245,158,11,0.2)',
                    }}>{label}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
