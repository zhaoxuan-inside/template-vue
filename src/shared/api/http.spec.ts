/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(globalThis, 'window', {
  value: { location: { href: '' } },
  writable: true,
})

describe('HTTP Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('test-token')
    localStorageMock.removeItem.mockImplementation(() => {})
    ;(window as { location: { href: string } }).location.href = '/'
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('sends GET request and returns data', async () => {
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn((url: string, config?: unknown) => {
          if (mockInstance._requestInterceptor) {
            mockInstance._requestInterceptor({
              url,
              ...(config || {}),
              headers: {},
            })
          }
          const response = { data: { value: 'test' } }
          if (mockInstance._responseInterceptor) {
            return Promise.resolve(mockInstance._responseInterceptor(response))
          }
          return Promise.resolve(response)
        }),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: {
            use: vi.fn((handler) => {
              mockInstance._requestInterceptor = handler
            }),
          },
          response: {
            use: vi.fn((handler) => {
              mockInstance._responseInterceptor = handler
            }),
          },
        },
        _requestInterceptor: null as ((config: unknown) => unknown) | null,
        _responseInterceptor: null as ((response: unknown) => unknown) | null,
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    const { get } = await import('./http')
    const result = await get('/data')

    expect(result).toEqual({ value: 'test' })
  })

  it('sends POST request with data', async () => {
    let capturedData: unknown = null
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(),
        post: vi.fn((_url: string, data?: unknown, _config?: unknown) => {
          capturedData = data
          const response = { data: { success: true } }
          if (mockInstance._responseInterceptor) {
            return Promise.resolve(mockInstance._responseInterceptor(response))
          }
          return Promise.resolve(response)
        }),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: {
            use: vi.fn((handler) => {
              mockInstance._responseInterceptor = handler
            }),
          },
        },
        _responseInterceptor: null as ((response: unknown) => unknown) | null,
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    const { post } = await import('./http')
    await post('/users', { name: 'John', email: 'john@example.com' })

    expect(capturedData).toEqual({ name: 'John', email: 'john@example.com' })
  })

  it('sends PUT request with data', async () => {
    let capturedData: unknown = null
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn((_url: string, data?: unknown, _config?: unknown) => {
          capturedData = data
          const response = { data: { success: true } }
          if (mockInstance._responseInterceptor) {
            return Promise.resolve(mockInstance._responseInterceptor(response))
          }
          return Promise.resolve(response)
        }),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: {
            use: vi.fn((handler) => {
              mockInstance._responseInterceptor = handler
            }),
          },
        },
        _responseInterceptor: null as ((response: unknown) => unknown) | null,
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    const { put } = await import('./http')
    await put('/users/1', { name: 'Updated' })

    expect(capturedData).toEqual({ name: 'Updated' })
  })

  it('sends DELETE request', async () => {
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn((_url: string, _config?: unknown) => {
          const response = { data: { success: true } }
          if (mockInstance._responseInterceptor) {
            return Promise.resolve(mockInstance._responseInterceptor(response))
          }
          return Promise.resolve(response)
        }),
        interceptors: {
          request: { use: vi.fn() },
          response: {
            use: vi.fn((handler) => {
              mockInstance._responseInterceptor = handler
            }),
          },
        },
        _responseInterceptor: null as ((response: unknown) => unknown) | null,
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    const { del } = await import('./http')
    const result = await del('/users/1')

    expect(result).toEqual({ success: true })
  })

  it('handles 401 error by removing token', async () => {
    let errorInterceptor: ((error: unknown) => Promise<never>) | null = null
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(() => Promise.reject({ response: { status: 401 } })),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: {
            use: vi.fn((_fulfilled: unknown, rejected: unknown) => {
              errorInterceptor = rejected as (error: unknown) => Promise<never>
            }),
          },
        },
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    await import('./http')

    if (errorInterceptor) {
      await expect(errorInterceptor({ response: { status: 401 } })).rejects.toMatchObject({
        response: { status: 401 },
      })
    }

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
  })

  it('handles network errors', async () => {
    const errorMsg = 'Network Error'
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(() => Promise.reject(new Error(errorMsg))),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: {
            use: vi.fn(),
            error: {
              use: vi.fn((handler) => {
                handler(new Error(errorMsg))
                return Promise.reject(new Error(errorMsg))
              }),
            },
          },
        },
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    const { get } = await import('./http')
    await expect(get('/error')).rejects.toThrow(errorMsg)
  })

  it('exports http instance', async () => {
    vi.doMock('axios', () => ({
      default: {
        create: vi.fn(() => ({
          get: vi.fn(),
          post: vi.fn(),
          put: vi.fn(),
          delete: vi.fn(),
          interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
          },
        })),
      },
    }))

    const { http } = await import('./http')
    expect(http).toBeDefined()
  })

  it('adds Authorization header when token exists', async () => {
    vi.doMock('axios', () => {
      const mockInstance = {
        get: vi.fn(() => Promise.resolve({ data: {} })),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: {
            use: vi.fn((handler) => {
              const result = handler({ url: '/test', headers: {} })
              mockInstance._requestHandler = result
            }),
          },
          response: { use: vi.fn() },
        },
        _requestHandler: null as unknown,
      }
      return {
        default: {
          create: vi.fn(() => mockInstance),
        },
      }
    })

    await import('./http')

    const axiosModule = await import('axios')
    const mockInstance = axiosModule.default.create()
    expect(mockInstance._requestHandler?.headers?.Authorization).toBe('Bearer test-token')
  })
})
