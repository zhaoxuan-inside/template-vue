import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { config } from '@vue/test-utils'

config.global.plugins = [createTestingPinia({ createSpy: vi.fn })]

vi.mock('naive-ui', () => ({
  NConfigProvider: {
    template: '<slot />',
  },
}))
