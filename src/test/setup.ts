import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { config } from '@vue/test-utils'

config.global.plugins = [createTestingPinia({ createSpy: vi.fn })]

vi.mock('naive-ui', () => ({
  NConfigProvider: { template: '<slot />' },
  NButton: { template: '<button><slot /></button>' },
  NInput: { template: '<input />' },
  NCard: { template: '<div><slot /></div>' },
  NLayout: { template: '<div><slot /></div>' },
  NLayoutHeader: { template: '<header><slot /></header>' },
  NLayoutContent: { template: '<main><slot /></main>' },
  NLayoutSider: { template: '<aside><slot /></aside>' },
  NMessageProvider: { template: '<slot />' },
  useMessage: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
  useDialog: () => ({
    create: vi.fn(),
  }),
  useNotification: () => ({
    create: vi.fn(),
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
    name: 'home',
  }),
}))

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
