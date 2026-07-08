import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, formatPhone, formatEmail } from './format'

describe('formatDate', () => {
  it('formats date as YYYY-MM-DD by default', () => {
    const date = new Date('2024-03-15')
    expect(formatDate(date)).toBe('2024-03-15')
  })

  it('formats date with custom format', () => {
    const date = new Date('2024-03-15T10:30:45')
    expect(formatDate(date, 'YYYY/MM/DD HH:mm:ss')).toBe('2024/03/15 10:30:45')
  })

  it('handles string date input', () => {
    expect(formatDate('2024-03-15')).toBe('2024-03-15')
  })

  it('pads single digit values', () => {
    const date = new Date('2024-01-05T09:05:03')
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 09:05:03')
  })
})

describe('formatCurrency', () => {
  it('formats CNY currency', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56')
  })

  it('formats USD currency', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('US$1,234.56')
  })

  it('handles zero amount', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })

  it('handles negative amount', () => {
    expect(formatCurrency(-100)).toBe('-¥100.00')
  })
})

describe('formatPhone', () => {
  it('masks middle digits of 11-digit phone', () => {
    expect(formatPhone('13812345678')).toBe('138****5678')
  })

  it('returns original for non-11-digit phone', () => {
    expect(formatPhone('123456')).toBe('123456')
    expect(formatPhone('138123456789')).toBe('138123456789')
  })
})

describe('formatEmail', () => {
  it('masks email with long username', () => {
    expect(formatEmail('zhangming@example.com')).toBe('zh***@example.com')
  })

  it('returns original for short username', () => {
    expect(formatEmail('ab@example.com')).toBe('ab@example.com')
  })

  it('returns original for invalid email', () => {
    expect(formatEmail('invalid-email')).toBe('invalid-email')
  })
})
