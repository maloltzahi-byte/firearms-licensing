'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

function safeNext(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/app'
  return value
}

function normalizedConfiguredOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (!configured) return null

  try {
    return new URL(configured).origin
  } catch {
    return null
  }
}

function isAllowedRequestOrigin(value: string, configuredOrigin: string | null) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    if (url.hostname.endsWith('.vercel.app')) return true
    return configuredOrigin ? url.origin === configuredOrigin : false
  } catch {
    return false
  }
}

async function authEmailOrigin() {
  const configuredOrigin = normalizedConfiguredOrigin()
  const requestHeaders = await headers()
  const requestOrigin = requestHeaders.get('origin')?.trim()

  if (requestOrigin && isAllowedRequestOrigin(requestOrigin, configuredOrigin)) {
    return new URL(requestOrigin).origin
  }

  const forwardedHost = requestHeaders.get('x-forwarded-host')?.split(',')[0]?.trim()
  if (forwardedHost && forwardedHost.endsWith('.vercel.app')) {
    return `https://${forwardedHost}`
  }

  if (configuredOrigin && !configuredOrigin.includes('localhost')) return configuredOrigin

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`

  return 'http://localhost:3000'
}

export async function login(formData: FormData) {
  const parsed = credentials.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  const next = safeNext(formData.get('next'))
  if (!parsed.success) redirect(`/login?error=required&next=${encodeURIComponent(next)}`)

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`)
  redirect(next)
}

export async function signup(formData: FormData) {
  const parsed = credentials.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) redirect('/login?error=required')

  const supabase = await createSupabaseServerClient()
  const origin = await authEmailOrigin()
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/app` },
  })
  if (error) redirect('/login?error=invalid')
  if (!data.session) redirect('/login?notice=verify')
  redirect('/app')
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = z.string().email().safeParse(formData.get('email'))
  if (!parsed.success) redirect('/login?error=reset_email_required')

  const supabase = await createSupabaseServerClient()
  const origin = await authEmailOrigin()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  })
  if (error) redirect('/login?error=reset_unavailable')

  redirect('/login?notice=reset')
}
