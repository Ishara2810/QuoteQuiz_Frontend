import { useMemo, useState } from 'react'
import type { QuoteDto } from '../../api/models/quotes'

export type QuotesTableProps = {
  quotes: QuoteDto[]
  onEdit: (quote: QuoteDto) => void
  onDelete: (quote: QuoteDto) => void
}

type SortKey = 'text' | 'author'
type SortDir = 'asc' | 'desc'

export default function QuotesTable({ quotes, onEdit, onDelete }: QuotesTableProps) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('text')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = quotes
    if (q) {
      arr = arr.filter((x) => x.text.toLowerCase().includes(q) || x.author.toLowerCase().includes(q))
    }
    const sorted = [...arr].sort((a, b) => {
      const aVal = (sortKey === 'text' ? a.text : a.author).toLowerCase()
      const bVal = (sortKey === 'text' ? b.text : b.author).toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [quotes, query, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="users-table">
      <div className="table-toolbar">
        <input
          className="text-input"
          placeholder="Search by text or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search quotes"
        />
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <button className="table-sort" onClick={() => toggleSort('text')}>
                  Text {sortKey === 'text' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button className="table-sort" onClick={() => toggleSort('author')}>
                  Author {sortKey === 'author' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSorted.map((q) => (
              <tr key={q.id}>
                <td>{q.text}</td>
                <td>{q.author}</td>
                <td className="col-actions">
                  <div className="action-group">
                    <button
                      className="icon-button"
                      onClick={() => onEdit(q)}
                      aria-label={`Edit quote by ${q.author}`}
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                    </button>
                    <button
                      className="icon-button icon-button--danger"
                      onClick={() => onDelete(q)}
                      aria-label={`Delete quote by ${q.author}`}
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
                <td colSpan={3} style={{ textAlign: 'center', color: '#a0a0a0' }}>
                  No quotes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


