export const site = {
  name: 'RFL — רישוי כלי ירייה פרטי',
  lawyerName: 'עו״ד צחי מלול',
  description: 'בדיקה ראשונית וליווי משפטי בהליכי רישוי כלי ירייה פרטי בישראל.',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://rfl-lead-mvp.vercel.app',
  phone: process.env.NEXT_PUBLIC_OFFICE_PHONE || '050-750-6224',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '0507506224',
  email: process.env.NEXT_PUBLIC_OFFICE_EMAIL || 'tzahimaloladv@gmail.com',
  accessibilityCoordinator: process.env.NEXT_PUBLIC_ACCESSIBILITY_COORDINATOR || 'עו״ד צחי מלול',
}

export function phoneHref() {
  return `tel:${site.phone.replace(/[^+\d]/g, '')}`
}

export function whatsappHref() {
  let normalized = site.whatsapp.replace(/\D/g, '')
  if (normalized.startsWith('0')) normalized = `972${normalized.slice(1)}`
  return `https://wa.me/${normalized}`
}
