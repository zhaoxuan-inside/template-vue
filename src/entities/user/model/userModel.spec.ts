import { describe, it, expect } from 'vitest'
import {
  createUser,
  formatUserDisplayName,
  getUserRoleLabel,
  isAdmin,
  hasPermission,
  validateUserCreateDto,
} from './userModel'
import type { User } from '../types'

describe('createUser', () => {
  it('creates user with default role', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }
    const user = createUser(dto)

    expect(user.id).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.name).toBe('Test User')
    expect(user.role).toBe('user')
    expect(user.createdAt).toBeDefined()
    expect(user.updatedAt).toBeDefined()
  })
})

describe('formatUserDisplayName', () => {
  it('returns name when available', () => {
    const user: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    expect(formatUserDisplayName(user)).toBe('Test User')
  })

  it('returns email prefix when name is empty', () => {
    const user: User = {
      id: 1,
      email: 'test@example.com',
      name: '',
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    expect(formatUserDisplayName(user)).toBe('test')
  })
})

describe('getUserRoleLabel', () => {
  it('returns correct label for each role', () => {
    expect(getUserRoleLabel('admin')).toBe('管理员')
    expect(getUserRoleLabel('user')).toBe('普通用户')
    expect(getUserRoleLabel('guest')).toBe('访客')
  })
})

describe('isAdmin', () => {
  it('returns true for admin user', () => {
    const adminUser: User = {
      id: 1,
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    expect(isAdmin(adminUser)).toBe(true)
  })

  it('returns false for non-admin user', () => {
    const userUser: User = {
      id: 1,
      email: 'user@example.com',
      name: 'User',
      role: 'user',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    }
    expect(isAdmin(userUser)).toBe(false)
  })
})

describe('hasPermission', () => {
  const adminUser: User = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  const regularUser: User = {
    id: 2,
    email: 'user@example.com',
    name: 'User',
    role: 'user',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  const guestUser: User = {
    id: 3,
    email: 'guest@example.com',
    name: 'Guest',
    role: 'guest',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  it('grants all permissions to admin', () => {
    expect(hasPermission(adminUser, 'read')).toBe(true)
    expect(hasPermission(adminUser, 'write')).toBe(true)
    expect(hasPermission(adminUser, 'delete')).toBe(true)
    expect(hasPermission(adminUser, 'manage')).toBe(true)
  })

  it('grants read and write to regular user', () => {
    expect(hasPermission(regularUser, 'read')).toBe(true)
    expect(hasPermission(regularUser, 'write')).toBe(true)
    expect(hasPermission(regularUser, 'delete')).toBe(false)
    expect(hasPermission(regularUser, 'manage')).toBe(false)
  })

  it('grants only read to guest', () => {
    expect(hasPermission(guestUser, 'read')).toBe(true)
    expect(hasPermission(guestUser, 'write')).toBe(false)
    expect(hasPermission(guestUser, 'delete')).toBe(false)
    expect(hasPermission(guestUser, 'manage')).toBe(false)
  })

  it('returns false for unknown permission', () => {
    expect(hasPermission(adminUser, 'unknown')).toBe(false)
  })
})

describe('validateUserCreateDto', () => {
  it('returns no errors for valid dto', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toEqual([])
  })

  it('returns error for empty email', () => {
    const dto = {
      email: '',
      password: 'password123',
      name: 'Test User',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('邮箱不能为空')
  })

  it('returns error for invalid email', () => {
    const dto = {
      email: 'invalid',
      password: 'password123',
      name: 'Test User',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('请输入有效的邮箱')
  })

  it('returns error for empty password', () => {
    const dto = {
      email: 'test@example.com',
      password: '',
      name: 'Test User',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('密码不能为空')
  })

  it('returns error for short password', () => {
    const dto = {
      email: 'test@example.com',
      password: '123',
      name: 'Test User',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('密码长度至少为6位')
  })

  it('returns error for empty name', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      name: '',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('姓名不能为空')
  })

  it('returns error for long name', () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'a'.repeat(51),
    }
    const errors = validateUserCreateDto(dto)
    expect(errors).toContain('姓名长度不能超过50个字符')
  })

  it('returns multiple errors for invalid dto', () => {
    const dto = {
      email: '',
      password: '123',
      name: '',
    }
    const errors = validateUserCreateDto(dto)
    expect(errors.length).toBe(3)
  })
})
