import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserById, updateUserQuizMode } from '../../api/controllers/usersController'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const token = user?.token ?? ''
  const userId = user?.userId ?? ''
  const queryClient = useQueryClient()

  const currentUserQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(token, userId),
    enabled: !!token && !!userId
  })

  const me = currentUserQuery.data

  const [localMode, setLocalMode] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: (mode: number) => updateUserQuizMode(token, userId, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      toast.success('Quiz mode updated')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update quiz mode')
    }
  })

  const effectiveMode = localMode ?? me?.quizMode ?? 0
  const isBinary = effectiveMode === 0

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {currentUserQuery.isPending ? (
        <p className="muted">Loading settings…</p>
      ) : currentUserQuery.isError ? (
        <p className="error-text">{(currentUserQuery.error as Error)?.message || 'Failed to load user'}</p>
      ) : (
        <div className="table-wrapper" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>Quiz mode</div>
              <div className="muted" style={{ textAlign: 'left' }}>{isBinary ? 'Binary' : 'Multiple'}</div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span>Binary</span>
              <button
                type="button"
                className="toggle-button"
                aria-pressed={!isBinary ? true : false}
                onClick={() => {
                  const nextMode = isBinary ? 1 : 0
                  setLocalMode(nextMode)
                  mutation.mutate(nextMode)
                }}
                disabled={mutation.isPending}
              >
                <span className={`knob ${isBinary ? '' : 'active'}`}></span>
              </button>
              <span>Multiple</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}


