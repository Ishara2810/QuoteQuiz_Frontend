export type LoginRequestDto = {
  email: string
  password: string
}

export type LoginResponseData = {
  token: string
  expiresAt: string
  refreshToken?: string
}

export type RefreshTokenRequestDto = {
  accessToken: string
  refreshToken: string
}


