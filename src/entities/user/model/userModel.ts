import type { User, UserRole, UserCreateDto } from '../types'

export function createUser(dto: UserCreateDto): User {
  return {
    id: Date.now(),
    email: dto.email,
    name: dto.name,
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function formatUserDisplayName(user: User): string {
  return user.name || user.email.split('@')[0]
}

export function getUserRoleLabel(role: UserRole): string {
  const roleLabels: Record<UserRole, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客',
  }
  return roleLabels[role]
}

export function isAdmin(user: User): boolean {
  return user.role === 'admin'
}

export function hasPermission(user: User, permission: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    admin: ['read', 'write', 'delete', 'manage'],
    user: ['read', 'write'],
    guest: ['read'],
  }
  return permissions[user.role]?.includes(permission) ?? false
}

export function validateUserCreateDto(dto: UserCreateDto): string[] {
  const errors: string[] = []
  if (!dto.email) {
    errors.push('邮箱不能为空')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
    errors.push('请输入有效的邮箱')
  }
  if (!dto.password) {
    errors.push('密码不能为空')
  } else if (dto.password.length < 6) {
    errors.push('密码长度至少为6位')
  }
  if (!dto.name) {
    errors.push('姓名不能为空')
  } else if (dto.name.length > 50) {
    errors.push('姓名长度不能超过50个字符')
  }
  return errors
}
