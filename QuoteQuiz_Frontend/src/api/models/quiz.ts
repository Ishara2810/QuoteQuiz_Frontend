export type QuizQuestionDto = {
  quoteId: string
  quoteText: string
  mode: number // 0: Binary, 1: Multiple choice
  binaryQuestionAuthor?: string | null
  options?: string[] | null
}

import type { UserDto as QuizUserDto } from '../models/users'
import type { QuoteDto as QuizQuoteDto } from '../models/quotes'

export type SubmitAnswerDto = {
  quoteId: string
  userId: string
  userAnswer: string
  binaryQuestionAuthor?: string | null
  quizMode: number
}

export type QuizAttemptDto = {
  id: string
  userId: string
  quoteId: string
  quizMode: number
  userAnswer: string
  correctAnswer?: string | null
  displayedAuthor?: string | null
  isCorrect: boolean
  answeredAt: string
  user: QuizUserDto
  quote: QuizQuoteDto
}


