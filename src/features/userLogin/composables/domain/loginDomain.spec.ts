import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLoginDomain } from './loginDomain'
import { post } from '@shared/api'

vi.mock('@shared/api', () => ({
  post: vi.fn(),
}))

describe('useLoginDomain', () => {
  beforeEach(() => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('validateCredentials', () => {
    it('returns no errors for valid credentials', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('test@example.com', 'password123')
      expect(errors).toEqual([])
    })

    it('returns error for empty email', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('', 'password123')
      expect(errors).toContain('请输入邮箱')
    })

    it('returns error for invalid email', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('invalid', 'password123')
      expect(errors).toContain('请输入有效的邮箱')
    })

    it('returns error for empty password', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('test@example.com', '')
      expect(errors).toContain('请输入密码')
    })

    it('returns error for short password', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('test@example.com', '123')
      expect(errors).toContain('密码长度至少为6位')
    })

    it('returns multiple errors for invalid credentials', () => {
      const { validateCredentials } = useLoginDomain()
      const errors = validateCredentials('', '123')
      expect(errors.length).toBe(2)
      expect(errors).toContain('请输入邮箱')
      expect(errors).toContain('密码长度至少为6位')
    })
  })

  describe('login', () => {
    it('logs in successfully and stores token', async () => {
      const mockResult = {
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        token: 'test-token',
      }
      ;(post as vi.Mock).mockResolvedValue(mockResult)

      const { login } = useLoginDomain()
      const user = await login('test@example.com', 'password123')

      expect(user).toEqual({ id: 1, email: 'test@example.com', name: 'Test User' })
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token')
      expect(post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('throws error on login failure', async () => {
      ;(post as vi.Mock).mockRejectedValue(new Error('Invalid credentials'))

      const { login } = useLoginDomain()
      await expect(login('test@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })
})
