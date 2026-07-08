import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLoginStore } from './loginStore'
import { useLoginDomain } from '../composables/domain'

vi.mock('../composables/domain', () => ({
  useLoginDomain: vi.fn(),
}))

describe('useLoginStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {})
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useLoginStore()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.currentUser).toBe(null)
    expect(store.isLoggedIn).toBe(false)
  })

  it('sets loading state during login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: 1, email: 'test@example.com' })
    ;(useLoginDomain as vi.Mock).mockReturnValue({ login: mockLogin })

    const store = useLoginStore()
    const loginPromise = store.login('test@example.com', 'password123')

    expect(store.isLoading).toBe(true)
    await loginPromise
    expect(store.isLoading).toBe(false)
  })

  it('sets currentUser on successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }
    const mockLogin = vi.fn().mockResolvedValue(mockUser)
    ;(useLoginDomain as vi.Mock).mockReturnValue({ login: mockLogin })

    const store = useLoginStore()
    await store.login('test@example.com', 'password123')

    expect(store.currentUser).toEqual(mockUser)
    expect(store.isLoggedIn).toBe(true)
    expect(store.error).toBe(null)
  })

  it('sets error on login failure', async () => {
    const mockError = new Error('Invalid credentials')
    const mockLogin = vi.fn().mockRejectedValue(mockError)
    ;(useLoginDomain as vi.Mock).mockReturnValue({ login: mockLogin })

    const store = useLoginStore()
    await expect(store.login('test@example.com', 'wrong-password')).rejects.toThrow()

    expect(store.error).toBe('Invalid credentials')
    expect(store.currentUser).toBe(null)
    expect(store.isLoggedIn).toBe(false)
  })

  it('clears state on logout', () => {
    const store = useLoginStore()
    store.currentUser = { id: 1, email: 'test@example.com' }
    store.error = 'Some error'

    store.logout()

    expect(store.currentUser).toBe(null)
    expect(store.error).toBe(null)
    expect(store.isLoggedIn).toBe(false)
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('clears error', () => {
    const store = useLoginStore()
    store.error = 'Some error'

    store.clearError()

    expect(store.error).toBe(null)
  })
})
