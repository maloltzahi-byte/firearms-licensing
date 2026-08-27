import { MfaSetup } from '@/components/app/mfa-setup'
import { requireLegalStaff } from '@/lib/auth/guards'

export default async function CockpitMfaPage() {
  await requireLegalStaff()
  return <main className="p-5 sm:p-8 lg:p-10"><MfaSetup /></main>
}
