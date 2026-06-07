import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="grid-bg">
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
        <Outlet />
      </main>
    </div>
  )
}
