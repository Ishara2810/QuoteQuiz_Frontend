import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createQuote, deleteQuote, listQuotes, updateQuote } from '../../api/controllers/quotesController'
import type { QuoteDto, QuotePostDto } from '../../api/models/quotes'
import QuotesTable from './QuotesTable'
import QuoteModal from './QuoteModal'
import { toast } from 'react-hot-toast'

export default function QuotesPage() {
  const { user } = useAuth()
  const isAdmin = (user?.role ?? '').toLowerCase() === 'admin'
  const token = user?.token ?? ''
  const queryClient = useQueryClient()

  const quotesQuery = useQuery({
    queryKey: ['quotes'],
    queryFn: () => listQuotes(token),
    enabled: !!token
  })

  const createMutation = useMutation({
    mutationFn: (payload: QuotePostDto) => createQuote(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      toast.success('Quote created successfully')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create quote')
    }
  })
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; payload: QuotePostDto }) => updateQuote(token, input.id, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      toast.success('Quote updated successfully')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update quote')
    }
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuote(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      toast.success('Quote deleted successfully')
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete quote')
    }
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<QuoteDto | null>(null)
  const isCreate = editing == null

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  const errorMessage = useMemo(() => {
    const e =
      (createMutation.error as Error) ||
      (updateMutation.error as Error) ||
      (deleteMutation.error as Error) ||
      (quotesQuery.error as Error) ||
      null
    return e?.message || null
  }, [createMutation.error, updateMutation.error, deleteMutation.error, quotesQuery.error])

  if (!isAdmin) return <Navigate to="/quiz" replace />

  return (
    <div>
      <div className="page-header">
        <h1>Quotes</h1>
        <button
          className="primary-button"
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
        >
          Add Quote
        </button>
      </div>

      {quotesQuery.isPending ? (
        <p className="muted">Loading quotes…</p>
      ) : quotesQuery.isError ? (
        <p className="error-text">{errorMessage}</p>
      ) : (
        <QuotesTable
          quotes={quotesQuery.data ?? []}
          onEdit={(q) => {
            setEditing(q)
            setModalOpen(true)
          }}
          onDelete={(q) => {
            if (!confirm(`Delete this quote by ${q.author}?`)) return
            deleteMutation.mutate(q.id)
          }}
        />
      )}

      {isCreate ? (
        <QuoteModal
          open={modalOpen}
          mode="create"
          onClose={() => {
            if (!isBusy) setModalOpen(false)
          }}
          onSubmitCreate={(values) => {
            createMutation.mutate(values, {
              onSuccess: () => setModalOpen(false)
            })
          }}
        />
      ) : (
        editing && (
          <QuoteModal
            open={modalOpen}
            mode="edit"
            initialQuote={editing}
            onClose={() => {
              if (!isBusy) setModalOpen(false)
            }}
            onSubmitEdit={(values) => {
              updateMutation.mutate(
                { id: editing.id, payload: values },
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


