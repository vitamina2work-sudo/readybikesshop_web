# Ficha técnica — Ready Bikes Shop / Ready Motos

> **Uso:** documento maestro para archivar accesos y procedimientos del proyecto.  
> **Contraseñas y claves secretas:** rellenar en tu gestor (Bitwarden, 1Password, etc.).  
> Aquí solo referencias del tipo `[EN GESTOR → …]`.  
> **No subas este archivo a GitHub si contiene secretos en texto plano.**

| Campo | Valor |
|---|---|
| **Cliente** | Ready Bikes Shop / Ready Motos |
| **Slug / PROYECTO_ID** | `ready-bikes-shop` _(ajustar si difiere en n8n/Sheet)_ |
| **Última revisión** | _______________ |
| **Revisado por** | _______________ |

---

## 1. Mapa de infraestructura

```
Visitante
    ↓
Cloudflare (DNS + proxy naranja)
    ↓
Hetzner — Easypanel (91.98.26.234)
    ↓
App React/Vite (contenedor)
    ↓
Supabase Cloud (Postgre + Auth + Storage)
    ↑
GitHub Actions (keep-alive cada 3 días, sin pasar por la web)
```

| Capa | Proveedor | Rol |
|---|---|---|
| DNS / CDN / SSL | Cloudflare | Dominio público |
| Hosting | Hetzner + Easypanel | Build y servicio web |
| Backend | Supabase (plan Free) | BD, login, imágenes |
| Código | GitHub | Repo + CI keep-alive |
| Analytics | Google Analytics 4 | Métricas web _(sin afectar keep-alive)_ |

---

## 2. URLs y accesos rápidos

| Recurso | URL | Notas |
|---|---|---|
| **Web producción** | https://readybikesshop.vitamina2work.com | |
| **Web local (dev)** | http://localhost:5173 | `npm run dev` |
| **Diagnóstico local** | http://localhost:5173/diagnostico | Comprueba Supabase |
| **Login admin** | /admin/login | |
| **Repo GitHub** | https://github.com/vitamina2work-sudo/readybikesshop_web | |
| **GitHub Actions** | …/actions/workflows/supabase-keepalive.yml | Keep-alive Supabase |
| **Panel Easypanel** | `[EN GESTOR]` | IP servidor: `91.98.26.234` |
| **Cloudflare Dashboard** | https://dash.cloudflare.com | |
| **Supabase Dashboard** | https://supabase.com/dashboard | Proyecto: Ready_Bikes_Shop |
| **Supabase Project URL** | `[EN GESTOR]` | Formato: `https://xxxxx.supabase.co` |
| **Dominio definitivo cliente** | `[PENDIENTE / EN GESTOR]` | ej. `readybikes.es` |

---

## 3. Credenciales (referencias al gestor)

> Crea en tu gestor una carpeta: **Ready Bikes Shop**  
> Copia los nombres de abajo como entradas. No escribas valores reales aquí si vas a versionar el doc.

### 3.1 Cloudflare

| Entrada gestor | Campo | Valor / referencia |
|---|---|---|
| CF-ReadyBikes-email | Email cuenta | `[EN GESTOR]` |
| CF-ReadyBikes-password | Contraseña | `[EN GESTOR]` |
| CF-ReadyBikes-zone | Zona DNS | `[EN GESTOR]` ej. `vitamina2work.com` |
| CF-ReadyBikes-api-token | Token API _(opcional)_ | `[EN GESTOR]` |

**DNS — subdominio web**

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| CNAME | `[EN GESTOR]` | `[EN GESTOR]` | 🟠 Proxied / ⚪ DNS only |
| SSL/TLS mode | | `[EN GESTOR]` | Flexible / Full / Strict |

### 3.2 Hetzner + Easypanel

| Entrada gestor | Campo | Valor / referencia |
|---|---|---|
| HZ-ReadyBikes-ip | IP servidor | `91.98.26.234` |
| EP-ReadyBikes-url | URL panel Easypanel | `[EN GESTOR]` |
| EP-ReadyBikes-user | Usuario Easypanel | `[EN GESTOR]` |
| EP-ReadyBikes-password | Contraseña Easypanel | `[EN GESTOR]` |
| EP-ReadyBikes-app | Nombre servicio/app | `[EN GESTOR]` |
| EP-ReadyBikes-preview-auth | Password Protection (preventa) | `[EN GESTOR]` sí / no |
| EP-ReadyBikes-github-webhook | Deploy auto vía GitHub | `[EN GESTOR]` activo / inactivo |

**Postgre en Hetzner** _(si aplica a este u otros proyectos)_

| Campo | Valor / referencia |
|---|---|
| Host | `[EN GESTOR]` |
| Puerto | `[EN GESTOR]` |
| Base de datos | `[EN GESTOR]` |
| Usuario | `[EN GESTOR]` |
| Contraseña | `[EN GESTOR]` |
| Uso en Ready Bikes Shop | `[EN GESTOR]` no usado / futuro / otro |

### 3.3 Supabase

| Entrada gestor | Campo | Valor / referencia |
|---|---|---|
| SB-ReadyBikes-org | Organización Supabase | `[EN GESTOR]` |
| SB-ReadyBikes-login | Cuenta acceso (GitHub/email) | `[EN GESTOR]` |
| SB-ReadyBikes-project | Nombre proyecto | `Ready_Bikes_Shop` |
| SB-ReadyBikes-ref | Project ref (ID) | `[EN GESTOR]` |
| SB-ReadyBikes-url | Project URL | `[EN GESTOR]` |
| SB-ReadyBikes-anon | Anon / publishable key | `[EN GESTOR]` |
| SB-ReadyBikes-service | Service role key ⚠️ secreta | `[EN GESTOR]` |
| SB-ReadyBikes-db-password | Contraseña Postgre Supabase | `[EN GESTOR]` |
| SB-ReadyBikes-plan | Plan | Free / Pro |
| SB-ReadyBikes-admin-email | Usuario admin Auth | `[EN GESTOR]` |
| SB-ReadyBikes-admin-password | Contraseña admin | `[EN GESTOR]` |

**Auth — URL Configuration (Supabase)**

| Campo | Valor |
|---|---|
| Site URL | `http://localhost:5173` _(dev)_ |
| Redirect URLs | `http://localhost:5173/**` |
| Redirect URLs prod | `https://readybikesshop.vitamina2work.com/**` |
| Redirect URLs dominio final | `[EN GESTOR]` |

### 3.4 GitHub

| Entrada gestor | Campo | Valor / referencia |
|---|---|---|
| GH-ReadyBikes-org | Usuario / org | `vitamina2work-sudo` |
| GH-ReadyBikes-repo | Repositorio | `readybikesshop_web` |
| GH-ReadyBikes-access | Colaboradores con acceso | `[EN GESTOR]` |
| GH-ReadyBikes-visibilidad | Público / Privado | `[EN GESTOR]` |

**GitHub Secrets** (Settings → Secrets and variables → Actions)

| Secret name | Descripción | Valor |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL Supabase | `[EN GESTOR]` |
| `VITE_SUPABASE_ANON_KEY` | Clave anon Supabase | `[EN GESTOR]` |

### 3.5 Google Analytics

| Entrada gestor | Campo | Valor / referencia |
|---|---|---|
| GA-ReadyBikes-id | ID propiedad GA4 | `[EN GESTOR]` ej. `G-XXXXXXXX` |
| GA-ReadyBikes-account | Cuenta Google | `[EN GESTOR]` |
| GA-ReadyBikes-method | Implementación | Tag directo / GTM |
| GA-ReadyBikes-gtm-id | ID GTM _(si aplica)_ | `[EN GESTOR]` |

### 3.6 Cliente / contacto

| Campo | Valor |
|---|---|
| Nombre comercial | Ready Motos |
| Dirección | Ctra. de Sabadell, 26, 08211 Castellar del Vallès |
| Teléfono | 644 69 22 04 |
| Email | readycastellar@gmail.com |
| WhatsApp (`VITE_WHATSAPP_NUMBER`) | `[EN GESTOR]` |

### 3.7 n8n / captura leads _(si aplica)_

| Campo | Valor / referencia |
|---|---|
| URL webhook n8n | `[EN GESTOR]` |
| PROYECTO_ID en Sheet | `[EN GESTOR]` |
| Google Sheet «Gestión de Webs» | `[EN GESTOR]` |
| Formulario contacto activo | sí / no |

---

## 4. Variables de entorno

### 4.1 Local (`.env` en Cursor)

Archivo: raíz del proyecto. **No commitear.** Plantilla: `.env.example`.

| Variable | Descripción | Valor |
|---|---|---|
| `VITE_SUPABASE_URL` | URL API Supabase | `[EN GESTOR]` |
| `VITE_SUPABASE_ANON_KEY` | Clave pública anon | `[EN GESTOR]` |
| `SUPABASE_DB_PASSWORD` | Pass BD _(solo admin/migraciones)_ | `[EN GESTOR]` |
| `VITE_WHATSAPP_NUMBER` | WhatsApp sin + | `[EN GESTOR]` |
| `VITE_SITE_NAME` | Nombre sitio | `Ready Motos` |
| `VITE_SITE_URL` | URL pública canonical | `https://readybikesshop.vitamina2work.com` |

> Tras cambiar `.env`: `Ctrl+C` → `npm run dev`.

### 4.2 Producción (Easypanel → Env Vars)

Deben coincidir con local (salvo `VITE_SITE_URL` de producción).

| Variable | Valor Easypanel |
|---|---|
| `VITE_SUPABASE_URL` | `[EN GESTOR]` |
| `VITE_SUPABASE_ANON_KEY` | `[EN GESTOR]` |
| `VITE_WHATSAPP_NUMBER` | `[EN GESTOR]` |
| `VITE_SITE_NAME` | `[EN GESTOR]` |
| `VITE_SITE_URL` | `[EN GESTOR]` |

---

## 5. Automatismo anti-pausa Supabase (GitHub Actions)

### 5.1 Contexto

En el **plan Free**, Supabase pausa proyectos tras **~7 días sin actividad en la base de datos**.  
No basta con entrar al dashboard; hace falta tráfico API real.

**Solución implementada:** workflow **Supabase Keep-Alive** en GitHub Actions.

| Aspecto | Detalle |
|---|---|
| Archivo | `.github/workflows/supabase-keepalive.yml` |
| Frecuencia | Cada **3 días** a las **08:00 UTC** (`cron: '0 8 */3 * *'`) |
| Método | `GET` a `/rest/v1/categories?select=id&limit=1` |
| Impacto GA | **Ninguno** — no carga la web, solo API Supabase |
| Ejecución manual | Actions → Supabase Keep-Alive → Run workflow |
| Commit despliegue | `511e117` — *Add Supabase keep-alive workflow to prevent free tier pausing* |
| Estado inicial | `[EN GESTOR]` OK manual el _______________ |

### 5.2 Requisitos

1. Secrets en GitHub (sección 3.4) configurados.
2. Tabla `categories` con lectura pública (RLS) — ya definida en migraciones.
3. Repo en GitHub con el workflow pusheado a `main`.

### 5.3 Verificación

1. GitHub → **Actions** → **Supabase Keep-Alive**.
2. Ejecución con **Status: Success** y log: `OK — actividad registrada en Supabase`.
3. Si falla:
   - `Faltan secrets` → crear secrets en GitHub.
   - `401/403` → revisar anon key o RLS.
   - `404/curl failed` → revisar Project URL.

### 5.4 Mantenimiento

| Tarea | Frecuencia |
|---|---|
| Revisar última ejecución en Actions | Mensual |
| Comprobar email de fallo GitHub | Si llega alerta |
| Tras cambiar URL/key Supabase | Actualizar secrets GitHub + `.env` + Easypanel |

---

## 6. Desarrollo local

| Campo | Valor |
|---|---|
| Ruta proyecto | `W:\CursorProjects\webs\Ready_Bikes_Shop_web` |
| Node.js | ≥ 20 (`package.json` → engines) |
| Instalar deps | `npm install` |
| Dev server | `npm run dev` → http://localhost:5173 |
| Build | `npm run build` |
| Preview build | `npm run preview` → puerto 3000 |
| Lint | `npm run lint` |

**Vite preview (Easypanel):** `allowedHosts: true`, `host: true`, `port: 3000`.

---

## 7. Despliegue y sincronización Git

Flujo habitual (protocolo Elias):

```bash
git pull origin main
# … cambios …
git add .
git commit -m "mensaje"
git push origin main
```

| Paso | Dónde | Notas |
|---|---|---|
| Pull antes de editar | Local | Evitar conflictos |
| Push a main | GitHub | Dispara webhook Easypanel si está activo |
| Env vars | Easypanel | Tras cambiar Supabase, actualizar y redeploy |
| Password Protection | Easypanel → General | Activar en preventa |

---

## 8. Supabase — migraciones y admin

**Orden SQL** (SQL Editor), carpeta `supabase/migrations/`:

1. `001_initial_schema.sql`
2. `002_profiles_and_roles.sql`
3. `003_fix_profiles_rls.sql`
4. `004_site_settings.sql`
5. `005_fix_storage_policies.sql`
6. `006_increase_storage_limit.sql`
7. `007_color_theme.sql`

**Promover admin** (ajustar email):

```sql
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'TU-EMAIL@...');
```

**Restaurar proyecto pausado:** Supabase Dashboard → proyecto → **Restore** → esperar ~30 s → comprobar `/diagnostico`.

---

## 9. Incidencias conocidas

| Síntoma | Causa probable | Acción |
|---|---|---|
| «No se puede resolver host Supabase (DNS)» | Proyecto pausado o URL incorrecta | Restaurar en Supabase; revisar `.env` |
| Login admin falla | Usuario no creado o sin rol admin | Auth → Users; SQL promote admin |
| Imágenes 403 | Storage policies / no admin | Migración 005; rol admin |
| Web caída tras push | Build Easypanel / env vars | Logs Easypanel; revisar Env Vars |
| Proyecto pausado otra vez | Sin actividad 7 días | Verificar Actions keep-alive; Run workflow manual |

---

## 10. Checklist mantenimiento

### Mensual

- [ ] GitHub Actions keep-alive: última ejecución OK
- [ ] Supabase dashboard: proyecto **Active** (no Paused)
- [ ] Easypanel: app running, último deploy OK
- [ ] Cloudflare: SSL válido, DNS correcto
- [ ] Backup mental: credenciales actualizadas en gestor

### Tras cambio de dominio

- [ ] Cloudflare DNS
- [ ] `VITE_SITE_URL` (local + Easypanel)
- [ ] Supabase Auth redirect URLs
- [ ] Redeploy Easypanel

### Tras rotar claves Supabase

- [ ] `.env` local
- [ ] Easypanel Env Vars
- [ ] GitHub Secrets (keep-alive)
- [ ] Redeploy + test `/diagnostico` y login admin

---

## 11. Reglas de oro (lecciones aprendidas)

1. **Supabase Free pausa a los 7 días** — el keep-alive en GitHub evita sorpresas sin ensuciar GA.
2. **Entrar a Supabase con la cuenta GitHub correcta** — si hay varias sesiones, usar incógnito.
3. **Nunca commitear `.env`** — solo `.env.example` sin secretos.
4. **Tras cambiar env vars, reiniciar** — Vite local y redeploy en Easypanel.
5. **Password Protection en preventa** — Easypanel → General.
6. **Diagnóstico rápido:** `/diagnostico` en local antes de culpar al código.
7. **Límite 2 proyectos Free** — pausar o eliminar proyectos que no uses; los pausados no cuentan en el límite.

---

## 12. Notas libres

_Espacio para anotaciones propias:_

```
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________
```

---

*Documento generado para rellenado manual (Opción B). Actualizar «Última revisión» en cada cambio relevante.*
