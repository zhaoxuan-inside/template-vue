import type { User } from '@entities/user'
import { post } from '@shared/api'

interface LoginResponse {
  user: User
  token: string
}

export function useLoginDomain() {
  const login = async (email: string, password: string): Promise<User> => {
    const result = await post<LoginResponse>('/api/auth/login', { email, password })
    localStorage.setItem('token', result.token)
    return result.user
  }

  const validateCredentials = (email: string, password: string): string[] => {
    const errors: string[] = []
    if (!email) {
      errors.push('请输入邮箱')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('请输入有效的邮箱')
    }
    if (!password) {
      errors.push('请输入密码')
    } else if (password.length < 6) {
      errors.push('密码长度至少为6位')
    }
    return errors
  }

  return {
    login,
    validateCredentials,
  }
}
