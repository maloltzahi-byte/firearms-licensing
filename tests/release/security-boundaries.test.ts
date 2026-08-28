import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(absolute)
    return [absolute]
  })
}

describe('client security boundaries', () => {
  it('does not commit a service-role secret in client-shippable source', () => {
    const roots = ['src', 'public'].map((part) => path.join(process.cwd(), part))
    const files = roots.flatMap(walk).filter((file) => /\.(?:ts|tsx|js|jsx|html)$/.test(file))

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      expect(content, file).not.toMatch(/sb_secret_[A-Za-z0-9_-]+/)
      expect(content, file).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY\s*[=:]\s*['\"][^'\"]+['\"]/)
    }
  })

  it('keeps authenticated app and cockpit paths in the auth middleware matcher', () => {
    const middleware = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8')
    expect(middleware).toContain("'/app/:path*'")
    expect(middleware).toContain("'/cockpit/:path*'")
  })
})
