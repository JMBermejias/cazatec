# Cazatec

PWA de gestión de caza (HTML/JS/CSS puros, localStorage, Leaflet/OSM local). Sin Firebase.

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
