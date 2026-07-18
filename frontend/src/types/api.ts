export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    username: string
    role: string
  }
}
