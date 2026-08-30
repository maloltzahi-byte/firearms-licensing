import { z } from 'zod'
import { ageOptions, citizenshipOptions, residencyOptions, serviceOptions } from './screening'

const normalizePhone = (value: unknown) => typeof value === 'string' ? value.replace(/[\s()-]/g, '') : value

export const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.preprocess(normalizePhone, z.string().regex(/^(?:\+972|972|0)[2-9]\d{7,8}$/)),
  email: z.string().trim().email().max(254),
  note: z.string().trim().max(500).optional().default(''),
  privacy: z.literal('on'),
  website: z.string().max(200).optional().default(''),
  startedAt: z.coerce.number().int().positive(),
  age: z.enum(ageOptions),
  citizenship: z.enum(citizenshipOptions),
  residencyYears: z.union([z.enum(residencyOptions), z.literal('')]).transform((value) => value || null),
  service: z.enum(serviceOptions),
  locality: z.string().trim().min(1).max(100),
  criteria: z.string().max(500),
  unsure: z.enum(['true', 'false']).transform((value) => value === 'true'),
})
