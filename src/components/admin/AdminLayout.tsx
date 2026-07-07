import { Navigate, Outlet, NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Bike, LayoutDashboard, Package, Tags, LogOut, Image } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Skeleton } from '@/components/ui/skeleton'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Artículos', href: '/admin/articulos', icon: Package },
  { label: 'Categorías', href: '/admin/categorias', icon: Tags },
  { label: 'Imágenes web', href: '/admin/sitio', icon: Image },
]

export function AdminLayout() {
  const { t } = useTranslation()
  const { user, loading, profileLoading, isAdmin, signOut } = useAuth()
  const authResolving = loading || profileLoading

  if (authResolving) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-4 font-bold">
          <Bike className="size-5 text-primary" />
          Admin
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-3 space-y-2">
          <Link
            to="/"
            className="block text-xs text-muted-foreground hover:text-primary transition-colors px-3"
          >
            ← {siteConfig.name}
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="size-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <nav className="flex gap-2 md:hidden overflow-x-auto">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === '/admin'}>
                {({ isActive }) => (
                  <Button variant={isActive ? 'secondary' : 'ghost'} size="sm">
                    <item.icon className="size-4" />
                    {item.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:block" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
