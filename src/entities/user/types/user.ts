export interface User {
  id: number
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface UserCreateDto {
  email: string
  password: string
  name: string
}

export interface UserUpdateDto {
  email?: string
  name?: string
  avatar?: string
}

export interface UserSearchDto {
  keyword?: string
  role?: UserRole
  page?: number
  pageSize?: number
}
