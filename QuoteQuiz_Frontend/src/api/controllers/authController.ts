import { API_BASE_URL, AUTH_LOGIN_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { LoginRequestDto, LoginResponseData } from '../models/auth'

export async function login(request: LoginRequestDto): Promise<LoginResponseData> {
  const response = await fetch(`${API_BASE_URL}${AUTH_LOGIN_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Login request failed with status ${response.status}`)
  }

  const envelope = (await response.json()) as ApiEnvelope<LoginResponseData>
  if (envelope.status !== 'Success') {
    const message =
      (Array.isArray(envelope.errorMessages) && envelope.errorMessages.join(', ')) ||
      'Login failed'
    throw new Error(message)
  }
  return envelope.data
}


