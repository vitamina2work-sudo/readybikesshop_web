import { useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Bike, User } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { useAuth } from '@/hooks/useAuth'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { buildAppointmentWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { parseNavHref, scrollToHash } from '@/lib/scrollToHash'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { settings } = useSiteSettings()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const appointmentUrl = buildWhatsAppUrl(buildAppointmentWhatsAppMessage(t))

  const isNavActive = (href: string) => {
    const parsed = parseNavHref(href)
    if (parsed.isHash) {
      return location.pathname === parsed.pathname && location.hash === parsed.hash
    }
    return location.pathname === href
  }

  const handleHashNavClick = (
    href: string,
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    const parsed = parseNavHref(href)
    if (!parsed.isHash) return

    const target = document.getElementById(parsed.hashId)
    const sameRoute =
      location.pathname === parsed.pathname && location.hash === parsed.hash

    if (sameRoute) {
      event.preventDefault()
      scrollToHash(parsed.hashId)
      return
    }

    if (target) {
      event.preventDefault()
      scrollToHash(parsed.hashId)
      window.history.pushState(null, '', `${location.pathname}${parsed.hash}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="" className="size-9 rounded-lg object-cover" />
          ) : (
            <Bike className="size-6 text-primary" />
          )}
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.nav.map((item) => {
            const parsed = parseNavHref(item.href)
            return (
              <Link
                key={item.href}
                to={parsed.to}
                onClick={(event) => handleHashNavClick(item.href, event)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isNavActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/cuenta">
                <User className="size-4" />
                {t('nav.account')}
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/cuenta/iniciar-sesion">{t('nav.login')}</Link>
            </Button>
          )}
          <Button variant="whatsapp" size="sm" className="hidden sm:inline-flex" asChild>
            <a href={appointmentUrl} target="_blank" rel="noopener noreferrer">
              {t('hero.appointment')}
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={t('nav.menu')}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t md:hidden animate-fade-in">
          <div className="flex flex-col gap-1 px-4 py-3">
            {siteConfig.nav.map((item) => {
              const parsed = parseNavHref(item.href)
              return (
                <Link
                  key={item.href}
                  to={parsed.to}
                  onClick={(event) => {
                    handleHashNavClick(item.href, event)
                    setOpen(false)
                  }}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                    isNavActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              )
            })}
            <Link
              to={user ? '/cuenta' : '/cuenta/iniciar-sesion'}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              {user ? t('nav.account') : t('nav.login')}
            </Link>
            <Button variant="whatsapp" className="mt-2" asChild>
              <a href={appointmentUrl} target="_blank" rel="noopener noreferrer">
                {t('whatsapp.appointmentMobile')}
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
