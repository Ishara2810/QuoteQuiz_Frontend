import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { login as loginRequest } from '../api/controllers/authController'
import type { LoginRequestDto } from '../api/models/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

type FormState = {
  email: string
  password: string
}

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequestDto) => loginRequest(payload),
    onSuccess: (data) => {
      auth.login(data.token, data.expiresAt, data.refreshToken ?? null)
      navigate('/quiz', { replace: true })
    }
  })
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false
  })

  const emailError = useMemo(() => {
    if (!formState.email) return 'Email is required'
    // Basic email structure check; not exhaustive
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formState.email) ? '' : 'Enter a valid email address'
  }, [formState.email])

  const passwordError = useMemo(() => {
    if (!formState.password) return 'Password is required'
    return formState.password.length >= 6 ? '' : 'Password must be at least 6 characters'
  }, [formState.password])

  const isFormValid = emailError === '' && passwordError === ''

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (!isFormValid) return
    loginMutation.mutate({ email: formState.email, password: formState.password })
  }

  return (
    <div className="login-container" role="main">
      <div className="login-card" aria-labelledby="login-title">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">QQ</div>
          <div className="brand-meta">
            <h1 id="login-title">Sign in to QuoteQuiz</h1>
            <p className="brand-subtitle">Welcome back! Please enter your details.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={touched.email && !!emailError}
              aria-describedby={touched.email && emailError ? 'email-error' : undefined}
              className="text-input"
            />
            {touched.email && emailError && (
              <div className="error-text" id="email-error" role="alert">
                {emailError}
              </div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="********"
                value={formState.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={touched.password && !!passwordError}
                aria-describedby={touched.password && passwordError ? 'password-error' : undefined}
                className="text-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash" aria-hidden="true"></i>
                ) : (
                  <i className="fa-regular fa-eye" aria-hidden="true"></i>
                )}
              </button>
            </div>
            {touched.password && passwordError && (
              <div className="error-text" id="password-error" role="alert">
                {passwordError}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={!isFormValid || loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        {loginMutation.isError && (
          <div className="error-text" role="alert" style={{ marginTop: 12 }}>
            {(loginMutation.error as Error)?.message || 'Login failed'}
          </div>
        )}
      </div>
    </div>
  )
}


