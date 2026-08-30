export const site = {
  name: 'RFL — רישוי כלי ירייה פרטי',
  lawyerName: 'עו״ד צחי מלול',
  description: 'בדיקה ראשונית וליווי משפטי בהליכי רישוי כלי ירייה פרטי בישראל.',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://rfl-lead-mvp.vercel.app',
  phone: process.env.NEXT_PUBLIC_OFFICE_PHONE || '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
  license: process.env.NEXT_PUBLIC_LAWYER_LICENSE || '',
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || '',
  email: process.env.NEXT_PUBLIC_OFFICE_EMAIL || '',
  accessibilityCoordinator: process.env.NEXT_PUBLIC_ACCESSIBILITY_COORDINATOR || 'עו״ד צחי מלול',
}

export function phoneHref() {
  return site.phone ? `tel:${site.phone.replace(/[^+\d]/g, '')}` : '#contact'
}

export function whatsappHref() {
  const normalized = site.whatsapp.replace(/\D/g, '')
  return normalized ? `https://wa.me/${normalized}` : '#contact'
}
