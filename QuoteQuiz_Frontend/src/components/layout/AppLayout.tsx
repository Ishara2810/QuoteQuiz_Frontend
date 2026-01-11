import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


