import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectsAPI, tasksAPI } from '../api/axios'
import { Modal, Badge, PriorityDot, Field, Select, PageLoader } from '../components/ui'
import { ArrowLeft, Plus, Trash2, Calendar, User } from 'lucide-react'

const COLUMNS = [
  { key: 'TODO',        label: '📋 To Do',       color: '#64748b' },
  { key: 'IN_PROGRESS', label: '🔄 In Progress',  color: '#3b82f6' },
  { key: 'IN_REVIEW',   label: '🔍 In Review',    color: '#a855f7' },
  { key: 'DONE',        label: '✅ Done',         color: '#22c55e' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' },
]

function TaskForm({ initial = {}, members = [], onSave, onClose, saving }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    priority: initial.priority || 'MEDIUM',
    status: initial.status || 'TODO',
    dueDate: initial.dueDate || '',
    assigneeId: initial.assignee?.id || '',
  })
  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <>
      <Field label="Task Title">
        <input name="title" value={form.title} onChange={h} className="input" placeholder="What needs to be done?" required />
      </Field>
      <Field label="Description">
        <textarea name="description" value={form.description} onChange={h}
          className="input" rows={2} placeholder="Details..." style={{ resize: 'vertical' }} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Priority">
          <Select name="priority" value={form.priority} onChange={h} options={PRIORITY_OPTIONS} />
        </Field>
        <Field label="Due Date">
          <input name="dueDate" type="date" value={form.dueDate} onChange={h} className="input" />
        </Field>
      </div>
      <Field label="Assignee">
        <Select name="assigneeId" value={form.assigneeId} onChange={h}
          options={[{ value: '', label: 'Unassigned' }, ...members.map(m => ({ value: m.user.id, label: m.user.name }))]} />
      </Field>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => onSave(form)} disabled={saving || !form.title}>
          {saving ? 'Saving…' : initial.id ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks]     = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [saving, setSaving]   = useState(false)

  const load = async () => {
    const [pRes, tRes] = await Promise.all([
      projectsAPI.getById(id),
      tasksAPI.getByProject(id),
    ])
    setProject(pRes.data)
    setTasks(tRes.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleSave = async form => {
    setSaving(true)
    try {
      if (modal?.id) await tasksAPI.update(id, modal.id, form)
      else           await tasksAPI.create(id, form)
      setModal(null); await load()
    } catch { alert('Error saving task') }
    finally { setSaving(false) }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    try { await tasksAPI.updateStatus(id, taskId, newStatus) }
    catch { await load() }
  }

  const handleDelete = async taskId => {
    if (!window.confirm('Delete this task?')) return
    try { await tasksAPI.delete(id, taskId); setTasks(ts => ts.filter(t => t.id !== taskId)) }
    catch { alert('Error deleting task') }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 28 }}>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 12 }}>
          <ArrowLeft size={14} /> All Projects
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, margin: 0 }}>{project?.title}</h1>
              <Badge value={project?.status} />
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{project?.description}</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({})}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="anim-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} className="kanban-col" style={{ padding: 14 }}>
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: 11, fontFamily: 'IBM Plex Mono',
                  background: 'var(--base-700)', color: 'var(--text-muted)',
                  borderRadius: 999, padding: '1px 8px',
                }}>{colTasks.length}</span>
              </div>

              {/* Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colTasks.map(task => (
                  <div key={task.id} className="card" style={{ padding: 12, cursor: 'pointer' }}
                    onClick={() => setModal(task)}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{task.title}</div>
                    {task.description && (
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.4,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <PriorityDot value={task.priority} />
                      {task.dueDate && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'IBM Plex Mono' }}>
                          <Calendar size={10} />{task.dueDate}
                        </span>
                      )}
                    </div>
                    {/* Status changer */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                      {COLUMNS.filter(c => c.key !== col.key).map(c => (
                        <button key={c.key} onClick={e => { e.stopPropagation(); handleStatusChange(task.id, c.key) }}
                          style={{
                            fontSize: 9, padding: '2px 6px', borderRadius: 4, border: `1px solid ${c.color}33`,
                            background: `${c.color}10`, color: c.color, cursor: 'pointer',
                          }}>
                          → {c.label.split(' ').slice(1).join(' ')}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {task.assignee && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <User size={10} />{task.assignee.name}
                        </span>
                      )}
                      <button onClick={e => { e.stopPropagation(); handleDelete(task.id) }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, marginLeft: 'auto' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 12, opacity: 0.5 }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modal !== null && (
        <Modal title={modal?.id ? 'Edit Task' : 'New Task'} onClose={() => setModal(null)}>
          <TaskForm initial={modal} members={members} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
        </Modal>
      )}
    </div>
  )
}
