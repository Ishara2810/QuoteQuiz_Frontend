import { refreshToken } from './controllers/authController'

export const ACCESS_TOKEN_KEY = 'auth_token'
export const REFRESH_TOKEN_KEY = 'auth_refreshToken'
export const EXPIRES_AT_KEY = 'auth_expiresAt'

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}, accessToken?: string): Promise<Response> {
  const stored = localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''
  const originalToken = stored || accessToken || ''
  const reqInit = { ...init, headers: buildHeaders(init.headers, originalToken) }

  let res = await fetch(input, reqInit)
  if (res.status !== 401 && res.status !== 403) {
    return res
  }

  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refresh || !originalToken) {
    return res
  }

  try {
    const refreshed = await refreshToken({ accessToken: originalToken, refreshToken: refresh })
    // store new tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, refreshed.token)
    if (refreshed.expiresAt) {
      const ms = new Date(refreshed.expiresAt).getTime()
      localStorage.setItem(EXPIRES_AT_KEY, String(ms))
    }
    if (refreshed.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshed.refreshToken)
    }
    const retryInit = { ...init, headers: buildHeaders(init.headers, refreshed.token) }
    return await fetch(input, retryInit)
  } catch {
    return res
  }
}

function buildHeaders(base: HeadersInit | undefined, token?: string): Headers {
  const headers = new Headers(base as any)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}


