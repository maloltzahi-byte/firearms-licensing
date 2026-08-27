import { CockpitShell } from '@/components/app/cockpit-shell'
import { requireStaff } from '@/lib/auth/guards'

export const dynamic = 'force-dynamic'

export default async function CockpitLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff()
  return <CockpitShell displayName={profile.display_name} role={profile.role}>{children}</CockpitShell>
}
