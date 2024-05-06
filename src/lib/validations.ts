import * as z from 'zod'

export const settingsSchema = z.object({
  displayName: z.string().min(1).max(12),
  description: z.string().max(120).optional(),
  slug: z.string().min(2).max(30)
})

