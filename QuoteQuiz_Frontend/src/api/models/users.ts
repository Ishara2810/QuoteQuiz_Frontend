export type UserRole = string

// Assuming backend uses camelCase JSON (ASP.NET default)
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
  RoleId: string
  FirstName: string
  LastName: string
  Email: string
  Password: string
  IsActive: boolean
}

export type CreateUserRequestDto = UserPostDto
export type UpdateUserRequestDto = UserPostDto


