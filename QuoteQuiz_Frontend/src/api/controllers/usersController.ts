import { API_BASE_URL, USERS_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserDto
} from '../models/users'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function listUsers(token: string): Promise<UserDto[]> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}`, {
    method: 'GET',
    headers: authHeaders(token)
  })
  if (!response.ok) {
    throw new Error(`Failed to load users (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<UserDto[]>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load users')
  }
  return envelope.data
}

export async function createUser(token: string, payload: CreateUserRequestDto): Promise<UserDto> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to create user (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<UserDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to create user')
  }
  return envelope.data
}

export async function updateUser(
  token: string,
  id: string,
  payload: UpdateUserRequestDto
): Promise<UserDto> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update user (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<UserDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to update user')
  }
  return envelope.data
}

export async function deleteUser(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to delete user (${response.status})`)
  }
}

// Optional convenience: update only status if your backend supports it.
export async function updateUserStatus(token: string, id: string, isActive: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/update-status/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ IsActive: isActive })
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update user status (${response.status})`)
  }
  // Backend returns envelope with null data on success; nothing to return
}

export async function updateUserQuizMode(token: string, id: string, quizMode: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/update-quiz-mode/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ QuizMode: quizMode })
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update quiz mode (${response.status})`)
  }
}

export async function getUserById(token: string, id: string): Promise<UserDto> {
  const response = await fetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: authHeaders(token)
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to load user (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<UserDto>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load user')
  }
  return envelope.data
}


