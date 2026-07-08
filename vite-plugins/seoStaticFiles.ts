import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const publicPaths = ['/', '/catalogo', '/politica-privacidad'] as const

const pathMeta: Record<(typeof publicPaths)[number], { changefreq: string; priority: string }> =
  {
    '/': { changefreq: 'weekly', priority: '1.0' },
    '/catalogo': { changefreq: 'daily', priority: '0.9' },
    '/politica-privacidad': { changefreq: 'yearly', priority: '0.3' },
  }

function buildRobotsTxt(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /cuenta/
Disallow: /diagnostico

Sitemap: ${base}/sitemap.xml
`
}

function buildSitemapXml(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  const urls = publicPaths
    .map((pathname) => {
      const meta = pathMeta[pathname]
      return `  <url>
    <loc>${base}${pathname === '/' ? '/' : pathname}</loc>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function seoStaticFilesPlugin(siteUrl: string): Plugin {
  return {
    name: 'seo-static-files',
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve('dist')
      fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8')
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemapXml(siteUrl), 'utf8')
    },
  }
}
