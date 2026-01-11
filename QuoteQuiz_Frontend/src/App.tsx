import './App.css'
import LoginPage from './pages/LoginPage'
import QuizPage from './pages/QuizPage'
import RequireAuth from './components/RequireAuth'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import UsersPage from './pages/users/UsersPage'
import QuotesPage from './pages/quotes/QuotesPage'
import AchievementsPage from './pages/achievements/AchievementsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
      </Route>
    </Routes>
  )
}
