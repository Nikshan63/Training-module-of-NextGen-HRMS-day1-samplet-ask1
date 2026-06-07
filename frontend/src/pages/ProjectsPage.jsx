import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectsAPI } from '../api/axios'
import { Modal, Badge, Field, Select, PageLoader, Empty } from '../components/ui'
import { Plus, Pencil, Trash2, ArrowRight, FolderKanban } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
]

function ProjectForm({ initial = {}, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    status: initial.status || 'ACTIVE',
  })
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <>
      <Field label="Project Title">
        <input name="title" value={form.title} onChange={handle}
          className="input" placeholder="e.g. Project Management Module" required />
      </Field>
      <Field label="Description">
        <textarea name="description" value={form.description} onChange={handle}
          className="input" rows={3} placeholder="Brief description of this project..."
          style={{ resize: 'vertical' }} />
      </Field>
      {initial.id && (
        <Field label="Status">
          <Select name="status" value={form.status} onChange={handle} options={STATUS_OPTIONS} />
        </Field>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => onSave(form)} disabled={saving || !form.title}>
          {saving ? 'Saving…' : initial.id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)   // null | 'create' | project obj
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = () =>
    projectsAPI.getAll()
      .then(r => setProjects(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleSave = async form => {
    setSaving(true)
    try {
      if (modal?.id) await projectsAPI.update(modal.id, form)
      else           await projectsAPI.create(form)
      setModal(null)
      load()
    } catch (e) { alert(e.response?.data?.message || 'Error saving project') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this project and all its tasks?')) return
    setDeleting(id)
    try { await projectsAPI.delete(id); setProjects(p => p.filter(x => x.id !== id)) }
    catch (e) { alert('Could not delete project') }
    finally { setDeleting(null) }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'IBM Plex Mono', margin: '0 0 4px' }}>WORKSPACE</p>
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: 0 }}>Projects</h1>
        </div>
        <button className="btn-primary" onClick={() => setModal('create')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <Empty icon="📁" message="No projects yet. Create your first project to get started."
          action={<button className="btn-primary" onClick={() => setModal('create')}>+ Create Project</button>} />
      ) : (
        <div className="anim-fade-up delay-1" style={{ display: 'grid', gap: 14 }}>
          {projects.map((p, i) => {
            const pct = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0
            return (
              <div key={p.id} className="card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 20, animationDelay: `${i * 0.04}s` }}>
                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--base-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FolderKanban size={20} color="var(--amber)" />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</span>
                    <Badge value={p.status} />
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {p.description || 'No description provided'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, maxWidth: 200, height: 4, background: 'var(--base-700)', borderRadius: 2 }}>
                      <div style={{ height: '100%', borderRadius: 2, background: 'var(--amber)', width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>
                      {pct}% · {p.completedTasks}/{p.totalTasks} tasks · {p.memberCount} members
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button className="btn-ghost" style={{ padding: '8px 10px' }}
                    onClick={() => setModal(p)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="btn-danger" style={{ padding: '8px 10px' }}
                    onClick={() => handleDelete(p.id)} disabled={deleting === p.id} title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <Link to={`/projects/${p.id}`} className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', padding: '8px 14px' }}>
                    Open <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'New Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <ProjectForm initial={modal === 'create' ? {} : modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
        </Modal>
      )}
    </div>
  )
}
