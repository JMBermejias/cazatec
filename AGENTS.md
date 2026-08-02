# Cazatec

PWA de gestión de caza (HTML/JS/CSS puros, localStorage, Leaflet/OSM local). Sin Firebase.

## Sincronización (Supabase)

Los datos se guardan en `localStorage` de cada dispositivo y se sincronizan en la nube con Supabase (gratis).

- Configuración en `db.js`: constantes `SUPABASE_URL` y `SUPABASE_ANON_KEY` (Settings > API). Sin configurar, la app funciona igual que antes, solo local.
- En Supabase (SQL Editor) hay que crear las tablas y políticas (seguras, por dispositivo):

```sql
create table if not exists sync_data (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists sync_devices (
  device_id uuid primary key,
  code text not null,
  updated_at timestamptz not null default now()
);

alter table sync_data enable row level security;
alter table sync_devices enable row level security;

drop policy if exists "public select" on sync_data;
drop policy if exists "public insert" on sync_data;
drop policy if exists "public update" on sync_data;

create policy "sync read" on sync_data for select
  using (exists (select 1 from sync_devices d where d.device_id = auth.uid() and d.code = sync_data.id));
create policy "sync insert" on sync_data for insert
  with check (exists (select 1 from sync_devices d where d.device_id = auth.uid() and d.code = sync_data.id));
create policy "sync update" on sync_data for update
  using (exists (select 1 from sync_devices d where d.device_id = auth.uid() and d.code = sync_data.id))
  with check (exists (select 1 from sync_devices d where d.device_id = auth.uid() and d.code = sync_data.id));

create policy "device read" on sync_devices for select
  using (device_id = auth.uid());
create policy "device insert" on sync_devices for insert
  with check (device_id = auth.uid());
create policy "device update" on sync_devices for update
  using (device_id = auth.uid())
  with check (device_id = auth.uid());
```

- Además hay que habilitar **Authentication > Sign In / Providers > Anonymous sign-ins** (la app crea una cuenta anónima por dispositivo automáticamente).
- El código de sincronización es la `id` de `sync_data` (`syncmeta.code` en localStorage). Se comparte entre dispositivos desde "Inicio > Datos y Sincronización". Cada dispositivo se registra en `sync_devices` con su `auth.uid()` y el código; RLS solo permite acceder a los dispositivos registrados con ese código.
- La librería está en `vendor/supabase/supabase.min.js` (local, offline, como Leaflet).
- Cambios locales (cualquier `cazatec_*`) marcan `pending` y se envían (1,5 s después); la app también sincroniza al abrir, al volver a primer plano, cada 60 s y al reconectarse.
- Merge por colección con huellas (`meta.fp`); si dos dispositivos editan la misma colección a la vez, gana el último que sube (last-write-wins).
- `updated_at` de la fila solo informativo; la lógica usa las huellas, no relojes.

### Avisos del Security Advisor (esperados, no son fallos)

Con los anónimos activados, el Security Advisor de Supabase muestra avisos que **no hay que "arreglar"**:

- **"Anonymous Sign-Ins Allowed"** en `sync_data` y `sync_devices` (lint `0012`): aparece solo porque los anónimos usan el rol `authenticated` y hay tablas con RLS. En esta app el anónimo **es el usuario por diseño** (cada dispositivo se autentica en anónimo). El acceso sigue limitado por fila: un dispositivo sin el código recibe `[]`. NO añadir cláusulas `is_anonymous = 'false'` porque romperían la sincronización.
- **"Leaked password protection"**: recomendación general de Auth para cuentas email/contraseña; la app no usa contraseñas. Se puede ignorar o activar en Authentication > Settings (no afecta).

Las alertas críticas de "RLS Policy Always True" NO deben aparecer: si reaparecen, algo va mal con el SQL de arriba.

## Flujo de trabajo obligatorio

- **Siempre** mantener sincronizados local, git y el despliegue.
- Después de cualquier cambio: commit en `master`, push de `master`, luego sincronizar la rama `gh-pages` con los mismos archivos y pushearla (GitHub Pages sirve desde `gh-pages`; un push a `master` NO despliega).
- Al cambiar `app.js`/`sw.js`/`index.html`, subir versión de caché: `app.js?v=N` y `SW_VERSION`/`CACHE_NAME` (`cazatec-vN`).

## Builds

- Instalador de escritorio `.exe`: `npm run dist` (Electron + electron-builder), salida en `dist/`.
- APK Android: `npx cap sync android` y gradle en `android/`, salida en `android/app/build/outputs/apk/`.
- `node_modules/`, `dist/`, `android/` y `*.apk`/`*.exe` NO se commitean.

## Estructura

- `index.html`, `app.js`, `db.js` (localStorage), `styles.css`, `sw.js` (service worker)
- `vendor/leaflet/` (Leaflet 1.9.4 local, offline)
- `main.js` + `package.json` (Electron), `capacitor.config.*` (Android)
