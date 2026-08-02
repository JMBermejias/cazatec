# Cazatec

PWA de gestión de caza (HTML/JS/CSS puros, localStorage, Leaflet/OSM local). Sin Firebase.

## Sincronización (Supabase)

Los datos se guardan en `localStorage` de cada dispositivo y se sincronizan en la nube con Supabase (gratis).

- Configuración en `db.js`: constantes `SUPABASE_URL` y `SUPABASE_ANON_KEY` (Settings > API). Sin configurar, la app funciona igual que antes, solo local.
- En Supabase (SQL Editor) hay que crear la tabla:

```sql
create table if not exists sync_data (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table sync_data enable row level security;
create policy "public select" on sync_data for select using (true);
create policy "public insert" on sync_data for insert with check (true);
create policy "public update" on sync_data for update using (true);
```

- El código de sincronización es la `id` de la fila (`syncmeta.code` en localStorage). Se comparte entre dispositivos desde "Inicio > Datos y Sincronización".
- La librería está en `vendor/supabase/supabase.min.js` (local, offline, como Leaflet).
- Cambios locales (cualquier `cazatec_*`) marcan `pending` y se envían (1,5 s después); la app también sincroniza al abrir, al volver a primer plano, cada 60 s y al reconectarse.
- Merge por colección con huellas (`meta.fp`); si dos dispositivos editan la misma colección a la vez, gana el último que sube (last-write-wins).
- `updated_at` de la fila solo informativo; la lógica usa las huellas, no relojes.

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
