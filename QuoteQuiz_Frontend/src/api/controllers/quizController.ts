import { API_BASE_URL, QUIZ_NEXT_PATH, QUIZ_SUBMIT_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { QuizAttemptDto, QuizQuestionDto, SubmitAnswerDto } from '../models/quiz'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function getNextQuestion(token: string): Promise<QuizQuestionDto> {
  const response = await fetch(`${API_BASE_URL}${QUIZ_NEXT_PATH}`, {
    method: 'GET',
    headers: authHeaders(token)
  })
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
  const response = await fetch(`${API_BASE_URL}${QUIZ_SUBMIT_PATH}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dto)
  })
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


