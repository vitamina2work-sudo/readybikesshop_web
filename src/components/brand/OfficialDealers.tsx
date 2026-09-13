import { useTranslation } from 'react-i18next'
import { officialDealers } from '@/config/brand'
import { cn } from '@/lib/utils'

type OfficialDealersProps = {
  variant?: 'hero' | 'compact'
  className?: string
}

export function OfficialDealers({ variant = 'hero', className }: OfficialDealersProps) {
  const { t } = useTranslation()
  const isHero = variant === 'hero'

  return (
    <div
      className={cn(
        isHero
          ? 'rounded-2xl border border-primary/15 bg-background/70 p-5 shadow-sm backdrop-blur-sm sm:p-6'
          : 'rounded-xl border bg-card/80 p-4',
        className
      )}
      aria-label={t('dealers.ariaLabel')}
    >
      <p
        className={cn(
          'font-semibold uppercase tracking-[0.14em] text-primary',
          isHero ? 'text-xs sm:text-sm' : 'text-[11px]'
        )}
      >
        {t('dealers.title')}
      </p>

      <div
        className={cn(
          'mt-4 flex flex-wrap items-center gap-6',
          isHero ? 'sm:gap-10' : 'gap-5'
        )}
      >
        {officialDealers.map((dealer) => (
          <a
            key={dealer.id}
            href={dealer.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group flex min-w-0 flex-col items-start gap-2 transition-opacity hover:opacity-90',
              isHero ? 'min-w-[140px] flex-1 sm:max-w-[220px]' : 'min-w-[120px] flex-1'
            )}
            aria-label={t('dealers.brandLink', { brand: dealer.name })}
          >
            <div
              className={cn(
                'flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 shadow-sm',
                isHero ? 'min-h-[72px] sm:min-h-[84px]' : 'min-h-[60px]'
              )}
            >
              <img
                src={dealer.logo}
                alt={dealer.name}
                className={cn(
                  'object-contain',
                  dealer.id === 'trrs' &&
                    (isHero
                      ? 'h-auto w-full max-w-[200px] sm:max-w-[220px]'
                      : 'h-auto w-full max-w-[160px]'),
                  dealer.id === 'beta' &&
                    (isHero ? 'h-14 w-auto max-w-full sm:h-16' : 'h-12 w-auto max-w-full')
                )}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  if (!event.currentTarget.src.includes('/images/placeholder.svg')) {
                    event.currentTarget.src = '/images/placeholder.svg'
                  }
                }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
              {dealer.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
