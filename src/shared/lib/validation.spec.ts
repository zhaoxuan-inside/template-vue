import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidIdCard,
  isPasswordStrong,
} from './validation'

describe('isValidEmail', () => {
  it('validates valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.org')).toBe(true)
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@invalid')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
    expect(isValidEmail('user@domain')).toBe(false)
  })
})

describe('isValidPhone', () => {
  it('validates valid Chinese phone number', () => {
    expect(isValidPhone('13812345678')).toBe(true)
    expect(isValidPhone('15987654321')).toBe(true)
    expect(isValidPhone('18612345678')).toBe(true)
  })

  it('rejects invalid phone number', () => {
    expect(isValidPhone('123456')).toBe(false)
    expect(isValidPhone('1381234567')).toBe(false)
    expect(isValidPhone('23812345678')).toBe(false)
    expect(isValidPhone('12812345678')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('validates valid URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://localhost:3000')).toBe(true)
    expect(isValidUrl('https://example.com/path?query=value')).toBe(true)
  })

  it('rejects invalid URL', () => {
    expect(isValidUrl('invalid')).toBe(false)
    expect(isValidUrl('example.com')).toBe(false)
    expect(isValidUrl('http://')).toBe(false)
  })
})

describe('isValidIdCard', () => {
  it('validates valid ID card number', () => {
    expect(isValidIdCard('110101199003071234')).toBe(true)
    expect(isValidIdCard('32010619850901123X')).toBe(true)
  })

  it('rejects invalid ID card number', () => {
    expect(isValidIdCard('123456')).toBe(false)
    expect(isValidIdCard('11010119900307123')).toBe(false)
    expect(isValidIdCard('110101199013071234')).toBe(false)
    expect(isValidIdCard('110101199002301234')).toBe(false)
  })
})

describe('isPasswordStrong', () => {
  it('validates strong password', () => {
    expect(isPasswordStrong('Password123!')).toBe(true)
    expect(isPasswordStrong('Abc123@#$')).toBe(true)
  })

  it('rejects weak password', () => {
    expect(isPasswordStrong('abc')).toBe(false)
    expect(isPasswordStrong('abcdefgh')).toBe(false)
    expect(isPasswordStrong('12345678')).toBe(false)
    expect(isPasswordStrong('ABCDEFGH')).toBe(false)
    expect(isPasswordStrong('abc12345')).toBe(false)
    expect(isPasswordStrong('ABC12345')).toBe(false)
  })
})
