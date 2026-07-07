import { describe, it, expect } from 'vitest'

describe('User Model', () => {
  it('should validate email format', () => {
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'

    const isValid = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    expect(isValid(validEmail)).toBe(true)
    expect(isValid(invalidEmail)).toBe(false)
  })

  it('should validate phone number format', () => {
    const validPhone = '13812345678'
    const invalidPhone = '123456'

    const isValid = (phone: string) => {
      return /^1[3-9]\d{9}$/.test(phone)
    }

    expect(isValid(validPhone)).toBe(true)
    expect(isValid(invalidPhone)).toBe(false)
  })

  it('should format user display name', () => {
    const formatDisplayName = (firstName: string, lastName: string) => {
      return `${lastName}${firstName}`
    }

    expect(formatDisplayName('明', '张')).toBe('张明')
    expect(formatDisplayName('雪', '李')).toBe('李雪')
  })
})
