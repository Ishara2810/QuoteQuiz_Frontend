import { API_BASE_URL, QUIZ_ATTEMPTS_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { QuizAttemptDto } from '../models/quiz'
import { authFetch } from '../http'

export async function listQuizAttempts(token: string): Promise<QuizAttemptDto[]> {
  const response = await authFetch(`${API_BASE_URL}${QUIZ_ATTEMPTS_PATH}`, { method: 'GET' }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to load achievements (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuizAttemptDto[]>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load achievements')
  }
  return envelope.data
}


