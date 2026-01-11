import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="brand-logo" aria-hidden="true">QQ</div>
        <span className="app-title">QuoteQuiz</span>
      </div>
      <div className="app-header__meta">
        {user?.email && <span className="user-meta">{user.firstName}</span>}
        {user?.role && <span className="user-role">{user.role}</span>}
        <button
          className="logout-button"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}


