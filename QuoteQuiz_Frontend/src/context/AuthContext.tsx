import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type DecodedJwt = {
  sub?: string
  email?: string
  exp?: number
  // Microsoft/JWT claim URIs for NameIdentifier and Role
  ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']?: string
  ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?: string | string[]
  role?: string | string[]
  roles?: string[]
  ['FirstName']?: string
  [key: string]: unknown
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '==='.slice((normalized.length + 3) % 4)
  if (typeof atob === 'function') {
    return atob(padded)
  }
  // Fallback if atob is unavailable (should not happen in modern browsers)
  return ''
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(decodeBase64Url(parts[1])) as DecodedJwt
    return payload
  } catch {
    return null
  }
}

export type AuthUser = {
  token: string
  userId: string | null
  email: string | null
  role: string | null
  firstName: string | null
  expiresAt: number | null
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (token: string, expiresAtIso?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'auth_token'
const EXPIRES_AT_KEY = 'auth_expiresAt'

function extractClaimsFromToken(token: string): Omit<AuthUser, 'token' | 'expiresAt'> {
  const decoded = decodeJwt(token)
  if (!decoded) {
    return { userId: null, email: null, role: null, firstName: null }
  }
  const userId =
    decoded.sub ||
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    null
  const email = decoded.email ?? null
  const firstName = (decoded['FirstName'] as string | undefined) ?? null

  const roleClaim =
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
    decoded.role ??
    decoded.roles

  let role: string | null = null
  if (Array.isArray(roleClaim)) {
    role = typeof roleClaim[0] === 'string' ? roleClaim[0] : null
  } else if (typeof roleClaim === 'string') {
    role = roleClaim
  }

  return { userId, email, role, firstName }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const expiresAtStr = localStorage.getItem(EXPIRES_AT_KEY)
    const expiresAt = expiresAtStr ? Number(expiresAtStr) : null
    if (!token || !expiresAt) return null
    const now = Date.now()
    if (expiresAt <= now) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EXPIRES_AT_KEY)
      return null
    }
    const claims = extractClaimsFromToken(token)
    return { token, expiresAt, ...claims }
  })

  const login = useCallback((token: string, expiresAtIso?: string) => {
    const claims = extractClaimsFromToken(token)
    // Prefer server-provided expiresAt if given, else use token exp if present
    const decoded = decodeJwt(token)
    let expiresAt: number | null = null
    if (expiresAtIso) {
      expiresAt = new Date(expiresAtIso).getTime()
    } else if (decoded?.exp) {
      expiresAt = decoded.exp * 1000
    }
    // Fallback 24h if none provided (shouldn't happen with your API)
    if (!expiresAt) {
      expiresAt = Date.now() + 24 * 60 * 60 * 1000
    }

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt))
    setUser({
      token,
      expiresAt,
      ...claims
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user?.token,
      login,
      logout
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


