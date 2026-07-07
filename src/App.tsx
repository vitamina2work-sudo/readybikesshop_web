import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/hooks/useTheme'
import { AuthProvider } from '@/hooks/useAuth'
import { SiteSettingsProvider } from '@/hooks/useSiteSettings'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { AccountLoginPage } from '@/pages/account/LoginPage'
import { RegisterPage } from '@/pages/account/RegisterPage'
import { AccountPage } from '@/pages/account/AccountPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ArticlesPage } from '@/pages/admin/ArticlesPage'
import { CategoriesPage } from '@/pages/admin/CategoriesPage'
import { SitePage } from '@/pages/admin/SitePage'
import { DiagnosticsPage } from '@/pages/DiagnosticsPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { ColorThemeApplier } from '@/components/ColorThemeApplier'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="catalogo" element={<CatalogPage />} />
              <Route path="cuenta/iniciar-sesion" element={<AccountLoginPage />} />
              <Route path="cuenta/registro" element={<RegisterPage />} />
              <Route path="cuenta" element={<AccountPage />} />
              <Route path="diagnostico" element={<DiagnosticsPage />} />
              <Route path="politica-privacidad" element={<PrivacyPolicyPage />} />
            </Route>

            <Route path="admin/login" element={<LoginPage />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="articulos" element={<ArticlesPage />} />
              <Route path="categorias" element={<CategoriesPage />} />
              <Route path="sitio" element={<SitePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ColorThemeApplier />
        </SiteSettingsProvider>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}
