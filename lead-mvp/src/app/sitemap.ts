import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/privacy', '/accessibility', '/terms'].map((path) => ({ url: `${site.url}${path}`, lastModified: new Date('2026-08-30'), changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : 0.4 }))
}
