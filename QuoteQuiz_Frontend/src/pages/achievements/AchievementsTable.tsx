import { useMemo, useState } from 'react'
import type { QuizAttemptDto } from '../../api/models/quiz'
import Pagination from '../../components/Pagination'

export type AchievementsTableProps = {
  attempts: QuizAttemptDto[]
}

type SortKey = 'name' | 'email' | 'quote' | 'author' | 'mode' | 'achievement'
type SortDir = 'asc' | 'desc'

export default function AchievementsTable({ attempts }: AchievementsTableProps) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'All' | 'Binary' | 'Multiple'>('All')
  const [achievement, setAchievement] = useState<'All' | 'Correct' | 'Wrong'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = attempts
    if (q) {
      arr = arr.filter((a) => {
        const name = `${a.user.firstName} ${a.user.lastName}`.trim().toLowerCase()
        return (
          name.includes(q) ||
          a.user.email.toLowerCase().includes(q) ||
          a.quote.text.toLowerCase().includes(q) ||
          a.quote.author.toLowerCase().includes(q)
        )
      })
    }
    if (mode !== 'All') {
      const code = mode === 'Binary' ? 0 : 1
      arr = arr.filter((a) => a.quizMode === code)
    }
    if (achievement !== 'All') {
      const want = achievement === 'Correct'
      arr = arr.filter((a) => a.isCorrect === want)
    }
    const sorted = [...arr].sort((a, b) => {
      const nameA = `${a.user.firstName} ${a.user.lastName}`.trim().toLowerCase()
      const nameB = `${b.user.firstName} ${b.user.lastName}`.trim().toLowerCase()

      let av: string, bv: string
      switch (sortKey) {
        case 'name':
          av = nameA
          bv = nameB
          break
        case 'email':
          av = a.user.email.toLowerCase()
          bv = b.user.email.toLowerCase()
          break
        case 'quote':
          av = a.quote.text.toLowerCase()
          bv = b.quote.text.toLowerCase()
          break
        case 'author':
          av = a.quote.author.toLowerCase()
          bv = b.quote.author.toLowerCase()
          break
        case 'mode':
          av = a.quizMode === 0 ? 'binary' : 'multiple'
          bv = b.quizMode === 0 ? 'binary' : 'multiple'
          break
        case 'achievement':
          av = a.isCorrect ? 'correct' : 'wrong'
          bv = b.isCorrect ? 'correct' : 'wrong'
          break
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [attempts, query, mode, achievement, sortKey, sortDir])

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
  if (page > 1 && start >= total && total > 0) {
    setPage(1)
  }

  return (
    <div className="users-table achievements-table">
      <div className="table-toolbar">
        <input
          className="text-input"
          placeholder="Search by name, email, text or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search achievements"
        />
        <select className="text-input" value={mode} onChange={(e) => setMode(e.target.value as any)} aria-label="Filter by mode">
          <option value="All">All modes</option>
          <option value="Binary">Binary</option>
          <option value="Multiple">Multiple</option>
        </select>
        <select className="text-input" value={achievement} onChange={(e) => setAchievement(e.target.value as any)} aria-label="Filter by achievement">
          <option value="All">All results</option>
          <option value="Correct">Correct</option>
          <option value="Wrong">Wrong</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <button className="table-sort" onClick={() => toggleSort('name')}>
                  User Name {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('email')}>
                  User Email {sortKey === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('quote')}>
                  Quote {sortKey === 'quote' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('author')}>
                  Author {sortKey === 'author' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('mode')}>
                  Quiz Mode {sortKey === 'mode' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>Displayed Answer</th>
              <th>User Answer</th>
              <th>Correct Answer</th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('achievement')}>
                  Achievement {sortKey === 'achievement' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((a) => (
              <tr key={a.id}>
                <td>{`${a.user.firstName} ${a.user.lastName}`.trim()}</td>
                <td>{a.user.email}</td>
                <td>{a.quote.text}</td>
                <td>{a.quote.author}</td>
                <td>{a.quizMode === 0 ? 'Binary' : 'Multiple'}</td>
                <td>{a.displayedAuthor ?? ''}</td>
                <td>{a.userAnswer}</td>
                <td>{a.correctAnswer ?? ''}</td>
                <td style={{ color: a.isCorrect ? '#22c55e' : '#ff6b6b', fontWeight: 600 }}>
                  {a.isCorrect ? 'Correct' : 'Wrong'}
                </td>
              </tr>
            ))}
            {filteredSorted.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#a0a0a0' }}>
                  No records found.
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


