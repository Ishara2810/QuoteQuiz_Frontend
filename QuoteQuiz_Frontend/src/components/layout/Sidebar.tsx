import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = (user?.role ?? '').toLowerCase() === 'admin'
  return (
    <aside className="app-sidebar" aria-label="Sidebar Navigation">
      <nav className="nav-vertical">
        <NavLink to="/quiz" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Quiz
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Settings
        </NavLink>
        <NavLink
          to="/achievements"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Achievements
        </NavLink>
        {isAdmin && (
          <>
            <NavLink
              to="/users"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Users
            </NavLink>
            <NavLink
              to="/quotes"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Quotes
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}


