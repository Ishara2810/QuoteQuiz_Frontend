export type UserRole = string

export type UserDto = {
  id: string
  roleId: string
  roleName: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  quizMode?: number
}

export type UserPostDto = {
  roleId: string
  firstName: string
  lastName: string
  email: string
  password: string
  isActive: boolean
}

export type CreateUserRequestDto = UserPostDto
export type UpdateUserRequestDto = UserPostDto


