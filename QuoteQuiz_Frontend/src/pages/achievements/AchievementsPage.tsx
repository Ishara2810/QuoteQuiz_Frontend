import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listQuizAttempts } from '../../api/controllers/quizAttemptController'
import AchievementsTable from './AchievementsTable'

export default function AchievementsPage() {
  const { user } = useAuth()
  const token = user?.token ?? ''
  const isAdmin = (user?.role ?? '').toLowerCase() === 'admin'

  const attemptsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: () => listQuizAttempts(token),
    enabled: !!token
  })

  // If non-admin, only show own attempts
  const data = useMemo(() => {
    const list = attemptsQuery.data ?? []
    if (isAdmin) return list
    const uid = user?.userId ?? ''
    return list.filter((a) => a.userId === uid)
  }, [attemptsQuery.data, isAdmin, user?.userId])

  if (!user?.token) return <Navigate to="/" replace />

  return (
    <div>
      <div className="page-header">
        <h1>Achievements</h1>
      </div>

      {attemptsQuery.isPending ? (
        <p className="muted">Loading achievements…</p>
      ) : attemptsQuery.isError ? (
        <p className="error-text">{(attemptsQuery.error as Error)?.message || 'Failed to load achievements'}</p>
      ) : (
        <AchievementsTable attempts={data} />
      )}
    </div>
  )
}


