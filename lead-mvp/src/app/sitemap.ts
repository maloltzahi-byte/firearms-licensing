import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

const pages: Array<{ path: string; changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>; priority: number }> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/privacy', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/accessibility', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/terms', changeFrequency: 'monthly', priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date('2026-08-30'),
    changeFrequency,
    priority,
  }))
}
