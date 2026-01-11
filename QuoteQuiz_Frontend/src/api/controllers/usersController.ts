import { API_BASE_URL, USERS_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserDto
} from '../models/users'
import { authFetch } from '../http'

export async function listUsers(token: string): Promise<UserDto[]> {
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}`, { method: 'GET' }, token)
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
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }, token)
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
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }, token)
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
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to delete user (${response.status})`)
  }
}

export async function updateUserStatus(token: string, id: string, isActive: boolean): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}/update-status/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IsActive: isActive })
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update user status (${response.status})`)
  }
}

export async function updateUserQuizMode(token: string, id: string, quizMode: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}/update-quiz-mode/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizMode })
  }, token)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Failed to update quiz mode (${response.status})`)
  }
}

export async function getUserById(token: string, id: string): Promise<UserDto> {
  const response = await authFetch(`${API_BASE_URL}${USERS_PATH}/${encodeURIComponent(id)}`, {
    method: 'GET'
  }, token)
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


