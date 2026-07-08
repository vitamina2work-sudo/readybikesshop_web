import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildLocalBusinessSchema, buildWebSiteSchema } from '@/lib/seo'

export function LocalBusinessJsonLd() {
  const { t } = useTranslation()
  const description = t('seo.localBusiness.description')

  const localBusiness = useMemo(
    () => buildLocalBusinessSchema(description),
    [description]
  )
  const website = useMemo(() => buildWebSiteSchema(description), [description])

  return (
    <>
      <JsonLd id="local-business" data={localBusiness} />
      <JsonLd id="website" data={website} />
    </>
  )
}
