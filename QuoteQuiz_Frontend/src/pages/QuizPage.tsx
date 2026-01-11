import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getNextQuestion, submitAnswer } from '../api/controllers/quizController'
import type { QuizAttemptDto, QuizQuestionDto, SubmitAnswerDto } from '../api/models/quiz'

export default function QuizPage() {
  const { user } = useAuth()
  const token = user?.token ?? ''
  const query = useQuery({
    queryKey: ['quiz-next'],
    queryFn: () => getNextQuestion(token),
    enabled: !!token,
    refetchOnWindowFocus: false
  })

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<QuizAttemptDto | null>(null)

  const submitMutation = useMutation({
    mutationFn: (dto: SubmitAnswerDto) => submitAnswer(token, dto),
    onSuccess: (data) => {
      setAttempt(data)
    }
  })

  function onAnswerBinary(answer: boolean, question: QuizQuestionDto) {
    if (!user?.userId) return
    const dto: SubmitAnswerDto = {
      quoteId: question.quoteId,
      userId: user.userId,
      userAnswer: answer ? 'Yes' : 'No',
      binaryQuestionAuthor: question.binaryQuestionAuthor ?? null,
      quizMode: question.mode
    }
    submitMutation.mutate(dto)
  }

  function onSubmitMultipleChoice(question: QuizQuestionDto) {
    if (!selectedOption) return
    if (!user?.userId) return
    const dto: SubmitAnswerDto = {
      quoteId: question.quoteId,
      userId: user.userId,
      userAnswer: selectedOption,
      binaryQuestionAuthor: null,
      quizMode: question.mode
    }
    submitMutation.mutate(dto)
  }

  return (
    <div className="login-container" role="main">
      <div className="login-card" aria-labelledby="quiz-title" style={{ maxWidth: 640 }}>
        {query.isPending && <p className="muted">Loading question…</p>}
        {query.isError && <p className="error-text">{(query.error as Error)?.message || 'Failed to load question'}</p>}
        {query.data && (
          <QuizCard
            question={query.data}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onAnswerBinary={onAnswerBinary}
            onSubmitMultipleChoice={onSubmitMultipleChoice}
            attempt={attempt}
            onNext={() => {
              setAttempt(null)
              setSelectedOption(null)
              query.refetch()
            }}
          />
        )}
      </div>
    </div>
  )
}

function QuizCard({
  question,
  selectedOption,
  setSelectedOption,
  onAnswerBinary,
  onSubmitMultipleChoice,
  attempt,
  onNext
}: {
  question: QuizQuestionDto
  selectedOption: string | null
  setSelectedOption: (v: string | null) => void
  onAnswerBinary: (answer: boolean, q: QuizQuestionDto) => void
  onSubmitMultipleChoice: (q: QuizQuestionDto) => void
  attempt: QuizAttemptDto | null
  onNext: () => void
}) {
  const isBinary = question.mode === 0
  const noText = !question.quoteText || question.quoteText.trim() === ''
  if (noText) {
    return (
      <div>
        <p className="muted" style={{ margin: 0, textAlign: 'center' }}>No quiz available</p>
      </div>
    )
  }
  return (
    <div>
      <h2 style={{ margin: 0 }}>Who said it</h2>
      <div className="quote-card" style={{ marginTop: 12, marginBottom: 16 }}>
        <blockquote style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.6 }}>
          “{question.quoteText}”
        </blockquote>
      </div>

      {attempt ? (
        <div>
          <p className="error-text" style={{ color: attempt.isCorrect ? '#22c55e' : '#ff6b6b', marginTop: 0 }}>
            {attempt.isCorrect
              ? `Correct! The right answer is: ${attempt.quote.author}.`
              : `Sorry, you are wrong! The right answer is: ${attempt.quote.author}.`}
          </p>
          <p className="author-text" style={{ margin: '8px 0 16px 0' }}>{attempt.quote.author}</p>
          <div className="quiz-actions">
            <button className="primary-button" onClick={onNext}>Next</button>
          </div>
        </div>
      ) : isBinary ? (
        <div>
          <p className="author-text" style={{ margin: '0 0 16px 0' }}>
            {question.binaryQuestionAuthor ?? ''}
            {question.binaryQuestionAuthor ? '?' : ''}
          </p>
          <div className="quiz-actions">
            <button className="primary-button" onClick={() => onAnswerBinary(true, question)}>Yes</button>
            <button className="secondary-button" onClick={() => onAnswerBinary(false, question)}>No</button>
          </div>
        </div>
      ) : (
        <form
          className="form-vertical"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmitMultipleChoice(question)
          }}
        >
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            {(question.options ?? []).map((opt) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={selectedOption === opt}
                  onChange={() => setSelectedOption(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </fieldset>
          <div className="quiz-actions">
            <button className="primary-button" type="submit" disabled={!selectedOption}>
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

