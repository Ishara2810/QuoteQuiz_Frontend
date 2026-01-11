import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="brand-logo" aria-hidden="true">QQ</div>
        <span className="app-title">QuoteQuiz</span>
      </div>
      <div className="app-header__meta">
        {user?.email && <span className="user-meta">{user.email}</span>}
        {user?.role && <span className="user-role">{user.role}</span>}
      </div>
    </header>
  )
}


