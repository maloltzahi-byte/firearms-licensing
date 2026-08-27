import { redirect } from 'next/navigation'

export default function CockpitLoginPage() {
  redirect('/login?next=/cockpit')
}
