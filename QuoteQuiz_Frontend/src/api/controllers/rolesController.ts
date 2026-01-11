import { API_BASE_URL, ROLES_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { RoleDto } from '../models/roles'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

export async function listRoles(token: string): Promise<RoleDto[]> {
  const response = await fetch(`${API_BASE_URL}${ROLES_PATH}`, {
    method: 'GET',
    headers: authHeaders(token)
  })
  if (!response.ok) {
    throw new Error(`Failed to load roles (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<RoleDto[]>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load roles')
  }
  return envelope.data
}


