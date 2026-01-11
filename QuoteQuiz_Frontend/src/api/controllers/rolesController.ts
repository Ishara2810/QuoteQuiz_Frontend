import { API_BASE_URL, ROLES_PATH } from '../../config'
import type { ApiEnvelope } from '../models/common'
import type { RoleDto } from '../models/roles'
import { authFetch } from '../http'

export async function listRoles(token: string): Promise<RoleDto[]> {
  const response = await authFetch(`${API_BASE_URL}${ROLES_PATH}`, { method: 'GET' }, token)
  if (!response.ok) {
    throw new Error(`Failed to load roles (${response.status})`)
  }
  const envelope = (await response.json()) as ApiEnvelope<RoleDto[]>
  if (envelope.status !== 'Success') {
    throw new Error('Failed to load roles')
  }
  return envelope.data
}


