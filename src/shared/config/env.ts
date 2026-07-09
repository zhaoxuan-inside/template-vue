import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_TITLE: z.string().min(1),
  VITE_ENABLE_MOCK: z.enum(['true', 'false']).optional(),
})

export const env = envSchema.parse(import.meta.env)
