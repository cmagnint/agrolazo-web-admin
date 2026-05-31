# Agrolazo Admin

Portal administrativo de Agrolazo construido con Next.js 16, App Router, TypeScript estricto y Tailwind v4.

## Instalar

```bash
npm install
```

## Correr en desarrollo

```bash
npm run dev
```

El servidor local corre en `http://localhost:3000`.

## Configuracion

La configuracion runtime server-only se define en `config.yaml`. El archivo mantiene la forma de la configuracion y usa placeholders `${VAR}`; `lib/env.ts` los resuelve contra `process.env` al cargar la app y falla si falta algun valor.

Mantener `.env` para desarrollo local: Next.js lo carga automaticamente y Docker Compose lo usa para interpolar variables. No leer `process.env` directamente para configuracion de la app; importar `config` desde `lib/env.ts` en codigo server-only.

Variables requeridas por `config.yaml`: `NODE_ENV`, `API_ORGANIZATION_URL`, `API_FACTORY_URL`, `SESSION_COOKIE_NAME`, `SESSION_COOKIE_SECURE`, `SESSION_MAX_AGE_SECONDS` y `HTTP_PORT`. `WEB_ADMIN_HOST_PORT` es solo para el puerto host de Docker Compose y no forma parte de la configuracion runtime.

## Qué hace esta iteración

- Inicializa el proyecto `web-admin` con Next.js 16, App Router, TypeScript estricto, Tailwind v4, alias `@/*` y Turbopack en desarrollo.
- Define la paleta marfil/cream base en `app/globals.css`.
- Valida la configuracion server-only de `web-admin` en `lib/env.ts`.
- Entrega una landing mínima en `/` con enlace futuro a `/login`.

## Qué NO hace

- No implementa `/login`.
- No implementa autenticación, cookies, JWT, logout ni middleware.
- No consume APIs ni llama a `api-organization`.
- No incluye nada de `api-factory`.
- No implementa CRUD, seed, cleanup ni datos de prueba.
