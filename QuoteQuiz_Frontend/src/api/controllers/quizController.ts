import { API_BASE_URL, QUIZ_NEXT_PATH, QUIZ_SUBMIT_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { QuizAttemptDto, QuizQuestionDto, SubmitAnswerDto } from '../models/quiz'
import { authFetch } from '../http'

export async function getNextQuestion(token: string): Promise<QuizQuestionDto> {
  const response = await authFetch(`${API_BASE_URL}${QUIZ_NEXT_PATH}`, { method: 'GET' }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to load next question (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuizQuestionDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load next question')
  }
  return envelope.data
}

export async function submitAnswer(token: string, dto: SubmitAnswerDto): Promise<QuizAttemptDto> {
  const response = await authFetch(`${API_BASE_URL}${QUIZ_SUBMIT_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto)
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to submit answer (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<QuizAttemptDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to submit answer')
  }
  return envelope.data
}


