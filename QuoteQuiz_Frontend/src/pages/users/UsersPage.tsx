import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, listUsers, updateUser, updateUserStatus } from '../../api/controllers/usersController'
import { listRoles } from '../../api/controllers/rolesController'
import type { CreateUserRequestDto, UpdateUserRequestDto, UserDto } from '../../api/models/users'
import { toast } from 'react-hot-toast'
import UsersTable from './UsersTable'
import UserModal from './UserModal'

export default function UsersPage() {
  const { user } = useAuth()
  const isAdmin = (user?.role ?? '').toLowerCase() === 'admin'
  const token = user?.token ?? ''
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(token),
    enabled: !!token
  })
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => listRoles(token),
    enabled: !!token
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserRequestDto) => createUser(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      toast.error(message)
    }
  })
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; payload: UpdateUserRequestDto }) =>
      updateUser(token, input.id, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to update user'
      toast.error(message)
    }
  })
  const statusMutation = useMutation({
    mutationFn: (input: { id: string; isActive: boolean }) => updateUserStatus(token, input.id, input.isActive),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`Status changed to ${variables.isActive ? 'Active' : 'Inactive'}`)
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to change status'
      toast.error(message)
    }
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete user'
      toast.error(message)
    }
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserDto | null>(null)
  const isCreate = editing == null

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const errorMessage = useMemo(() => {
    const e =
      (createMutation.error as Error) ||
      (updateMutation.error as Error) ||
      (deleteMutation.error as Error) ||
      (usersQuery.error as Error) ||
      null
    return e?.message || null
  }, [createMutation.error, updateMutation.error, deleteMutation.error, usersQuery.error])

  if (!isAdmin) {
    return <Navigate to="/quiz" replace />
  }

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          Add User
        </button>
      </div>

      {usersQuery.isPending ? (
        <p className="muted">Loading users…</p>
      ) : usersQuery.isError ? (
        <p className="error-text">{errorMessage}</p>
      ) : (
        <UsersTable
          users={usersQuery.data ?? []}
          roles={rolesQuery.data ?? []}
          onEdit={(u) => {
            setEditing(u)
            setModalOpen(true)
          }}
          onDelete={(u) => {
            if (!confirm(`Delete user ${u.email}?`)) return
            deleteMutation.mutate(u.id)
          }}
          onChangeStatus={(u, isActive) => {
            const target = isActive ? 'Active' : 'Inactive'
            if (!confirm(`Change status for ${u.email} to ${target}?`)) return
            statusMutation.mutate({ id: u.id, isActive })
          }}
        />
      )}

      {isCreate ? (
        <UserModal
          open={modalOpen}
          mode="create"
          roles={rolesQuery.data ?? []}
          onClose={() => {
            if (!isBusy) setModalOpen(false)
          }}
          onSubmitCreate={(values) => {
            const payload: CreateUserRequestDto = {
              RoleId: values.RoleId,
              FirstName: values.FirstName,
              LastName: values.LastName,
              Email: values.Email,
              Password: values.Password,
              IsActive: true
            }
            createMutation.mutate(payload, {
              onSuccess: () => setModalOpen(false)
            })
          }}
        />
      ) : (
        editing && (
          <UserModal
            open={modalOpen}
            mode="edit"
            initialUser={editing}
            roles={rolesQuery.data ?? []}
            onClose={() => {
              if (!isBusy) setModalOpen(false)
            }}
            onSubmitEdit={(values) => {
              updateMutation.mutate(
                { id: editing.id, payload: { ...values, Password: '' } },
                {
                  onSuccess: () => setModalOpen(false)
                }
              )
            }}
          />
        )
      )}
    </div>
  )
}


