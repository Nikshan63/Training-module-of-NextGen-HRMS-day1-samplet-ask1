import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectsAPI, tasksAPI } from '../api/axios'
import { Badge, PageLoader } from '../components/ui'
import { FolderKanban, CheckSquare, Users, TrendingUp, ArrowRight, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => setProjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const totalTasks     = projects.reduce((s, p) => s + (p.totalTasks || 0), 0)
  const completedTasks = projects.reduce((s, p) => s + (p.completedTasks || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length

  const stats = [
    { label: 'Total Projects',    value: projects.length, icon: FolderKanban, color: '#f59e0b' },
    { label: 'Active Projects',   value: activeProjects,  icon: TrendingUp,   color: '#60a5fa' },
    { label: 'Total Tasks',       value: totalTasks,      icon: CheckSquare,  color: '#c084fc' },
    { label: 'Completed Tasks',   value: completedTasks,  icon: CheckSquare,  color: '#4ade80' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 36 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'IBM Plex Mono', margin: '0 0 4px' }}>
          Welcome back,
        </p>
        <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, margin: 0 }}>
          {user?.name} <span style={{ color: 'var(--amber)' }}>👋</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="anim-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'IBM Plex Mono' }}>
                {label}
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Syne', color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="anim-fade-up delay-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, margin: 0 }}>Recent Projects</h2>
          <Link to="/projects" style={{
            display: 'flex', alignItems: 'center', gap: 4, color: 'var(--amber)',
            textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <FolderKanban size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ margin: '0 0 16px' }}>No projects yet. Create your first one.</p>
            <Link to="/projects" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <Plus size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              New Project
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {projects.slice(0, 6).map(p => {
              const pct = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className="card" style={{ padding: 20, textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</h3>
                    <Badge value={p.status} />
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {p.description?.slice(0, 70) || 'No description'}
                  </p>
                  {/* Progress bar */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontFamily: 'IBM Plex Mono' }}>
                      <span>Progress</span><span>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--base-700)', borderRadius: 2 }}>
                      <div style={{ height: '100%', borderRadius: 2, background: 'var(--amber)', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>👥 {p.memberCount} members</span>
                    <span>✅ {p.completedTasks}/{p.totalTasks} tasks</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
