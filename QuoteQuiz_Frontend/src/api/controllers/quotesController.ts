import { API_BASE_URL, QUOTES_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { QuoteDto, QuotePostDto } from '../models/quotes'
import { authFetch } from '../http'

export async function listQuotes(token: string): Promise<QuoteDto[]> {
  const response = await authFetch(`${API_BASE_URL}${QUOTES_PATH}`, { method: 'GET' }, token)
  if (!response.ok) {
    throw new Error(`Failed to load quotes (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuoteDto[]>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load quotes')
  }
  return envelope.data
}

export async function createQuote(token: string, payload: QuotePostDto): Promise<QuoteDto> {
  const response = await authFetch(`${API_BASE_URL}${QUOTES_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to create quote (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuoteDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to create quote')
  }
  return envelope.data
}

export async function updateQuote(token: string, id: string, payload: QuotePostDto): Promise<QuoteDto> {
  const response = await authFetch(`${API_BASE_URL}${QUOTES_PATH}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update quote (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuoteDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to update quote')
  }
  return envelope.data
}

export async function deleteQuote(token: string, id: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}${QUOTES_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to delete quote (${response.status})`)
  }
}


