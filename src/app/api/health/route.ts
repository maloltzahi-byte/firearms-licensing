import { NextResponse } from 'next/server'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export const dynamic = 'force-dynamic'

async function probe(url: string, init?: RequestInit) {
  const started = Date.now()
  try {
    const response = await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(7000),
    })
    return {
      healthy: response.ok,
      status: response.status,
      latency_ms: Date.now() - started,
    }
  } catch {
    return {
      healthy: false,
      status: 0,
      latency_ms: Date.now() - started,
    }
  }
}

export async function GET() {
  const url = getSupabaseUrl().replace(/\/$/, '')
  const key = getSupabasePublishableKey()
  const apiKeyHeaders = { apikey: key }

  const [auth, databaseApi] = await Promise.all([
    probe(`${url}/auth/v1/health`, { headers: apiKeyHeaders }),
    probe(`${url}/rest/v1/rpc/health_ping`, {
      method: 'POST',
      headers: {
        ...apiKeyHeaders,
        'Content-Type': 'application/json',
      },
      body: '{}',
    }),
  ])

  const healthy = auth.healthy && databaseApi.healthy

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      app: 'healthy',
      auth,
      database_api: databaseApi,
      release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? 'local',
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
