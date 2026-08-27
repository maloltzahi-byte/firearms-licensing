import { ClientShell } from '@/components/app/client-shell'
import { requireProfile } from '@/lib/auth/guards'

export const dynamic = 'force-dynamic'

export default async function ClientAreaLayout({ children }: { children: React.ReactNode }) {
  await requireProfile()
  return <ClientShell>{children}</ClientShell>
}
