import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { applyPageSeo } from '@/lib/seo'

const routeSeoKeys: Record<string, { title: string; description: string; noindex?: boolean } | null> =
  {
    '/': { title: 'seo.home.title', description: 'seo.home.description' },
    '/catalogo': { title: 'seo.catalog.title', description: 'seo.catalog.description' },
    '/politica-privacidad': {
      title: 'seo.privacy.title',
      description: 'seo.privacy.description',
    },
    '/cuenta/iniciar-sesion': {
      title: 'seo.accountLogin.title',
      description: 'seo.accountLogin.description',
      noindex: true,
    },
    '/cuenta/registro': {
      title: 'seo.accountRegister.title',
      description: 'seo.accountRegister.description',
      noindex: true,
    },
    '/cuenta': {
      title: 'seo.account.title',
      description: 'seo.account.description',
      noindex: true,
    },
    '/diagnostico': {
      title: 'seo.diagnostics.title',
      description: 'seo.diagnostics.description',
      noindex: true,
    },
  }

export function PublicPageSeo() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const keys = routeSeoKeys[pathname] ?? {
      title: 'seo.default.title',
      description: 'seo.default.description',
      noindex: true,
    }

    applyPageSeo(
      {
        title: t(keys.title, { name: t('seo.siteName') }),
        description: t(keys.description),
        path: pathname,
        noindex: keys.noindex,
      },
      i18n.language
    )
  }, [pathname, t, i18n.language])

  return null
}
