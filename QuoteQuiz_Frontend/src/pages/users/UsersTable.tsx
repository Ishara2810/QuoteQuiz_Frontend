import { useMemo, useState } from 'react'
import type { UserDto } from '../../api/models/users'
import type { RoleDto } from '../../api/models/roles'
import Pagination from '../../components/Pagination'

export type UsersTableProps = {
  users: UserDto[]
  roles: RoleDto[]
  onEdit: (user: UserDto) => void
  onDelete: (user: UserDto) => void
  onChangeStatus: (user: UserDto, isActive: boolean) => void
}

type SortKey = 'name' | 'email' | 'role' | 'status'
type SortDir = 'asc' | 'desc'

export default function UsersTable({ users, roles, onEdit, onDelete, onChangeStatus }: UsersTableProps) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<string | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = users
    if (q) {
      arr = arr.filter((u) => {
        const name = `${u.firstName} ${u.lastName}`.trim().toLowerCase()
        return name.includes(q) || u.email.toLowerCase().includes(q)
      })
    }
    if (role !== 'All') {
      arr = arr.filter((u) => u.roleName === role)
    }
    const sorted = [...arr].sort((a, b) => {
      let aVal: string, bVal: string
      if (sortKey === 'name') {
        aVal = `${a.firstName} ${a.lastName}`.trim().toLowerCase()
        bVal = `${b.firstName} ${b.lastName}`.trim().toLowerCase()
      } else if (sortKey === 'email') {
        aVal = a.email.toLowerCase()
        bVal = b.email.toLowerCase()
      } else if (sortKey === 'role') {
        aVal = (a.roleName || '').toLowerCase()
        bVal = (b.roleName || '').toLowerCase()
      } else {
        aVal = a.isActive ? 'active' : 'inactive'
        bVal = b.isActive ? 'active' : 'inactive'
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [users, query, role, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const total = filteredSorted.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const pageItems = filteredSorted.slice(start, start + pageSize)

  if (page > 1 && start >= total && total > 0) setPage(1)

  return (
    <div className="users-table">
      <div className="table-toolbar">
        <input
          className="text-input"
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search by email"
        />
        <select
          className="text-input"
          value={role}
          onChange={(e) => setRole(e.target.value as string | 'All')}
          aria-label="Filter by role"
        >
          <option value="All">All roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <button className="table-sort" onClick={() => toggleSort('name')}>
                  Name {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('email')}>
                  Email {sortKey === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('role')}>
                  Role {sortKey === 'role' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('status')}>
                  Status {sortKey === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.id}>
                <td>{`${u.firstName} ${u.lastName}`.trim()}</td>
                <td>{u.email}</td>
                <td>{u.roleName}</td>
                <td>
                  <select
                    className="text-input"
                    value={u.isActive ? 'Active' : 'Inactive'}
                    onChange={(e) => onChangeStatus(u, e.target.value === 'Active')}
                    aria-label={`Change status for ${u.email}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="col-actions">
                  <div className="action-group">
                    <button
                      className="icon-button"
                      onClick={() => onEdit(u)}
                      aria-label={`Edit ${u.email}`}
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                    </button>
                    <button
                      className="icon-button icon-button--danger"
                      onClick={() => onDelete(u)}
                      aria-label={`Delete ${u.email}`}
                      title="Delete"
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSorted.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#a0a0a0' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s)
          setPage(1)
        }}
      />
    </div>
  )
}


