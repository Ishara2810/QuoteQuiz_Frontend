export type LoginRequestDto = {
  // C# DTO uses PascalCase by default in JSON
  Email: string
  Password: string
}

export type LoginResponseData = {
  token: string
  expiresAt: string
}


