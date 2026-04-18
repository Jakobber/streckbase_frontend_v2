# Streckbase Frontend V2

## Project Overview
Angular 7 frontend for the streckbase workplace beverage purchase tracking system.

## Tech Stack
- **Framework**: Angular 7.0.0
- **Language**: TypeScript ~3.1.6
- **Styles**: SCSS
- **Port**: 4200 (ng serve default)

## Architecture
- `src/app/pages/` — page components (front, add, admin, item, party, user, users)
- `src/app/components/` — shared components (clock, feed, header, highscore, menu)
- `src/app/core/` — core services
- `src/app/shared/` — shared UI (action-bar, button, checkbox, modal, spinner, user-card, wrapper)
- `src/app/types/` — TypeScript types
- `src/environments/environment.ts` — API URL config

## API Connection
All services use `environment.apiUrl` as base URL prefix via Angular `HttpClient`.

**For local dev**, `src/environments/environment.ts` should be:
```typescript
export const environment = {
  production: false,
  // apiUrl: "https://streckbase.nu/api",
  apiUrl: "http://localhost:8080/api"
};
```
**Important**: The repo default points to production (`https://streckbase.nu/api`). Always switch to localhost for local dev.

## Local Dev Setup
1. `npm install -g @angular/cli`
2. `npm install`
3. Edit `src/environments/environment.ts` — set apiUrl to `http://localhost:8080/api`
4. `npm start` — runs on http://localhost:4200

## Backend
- Repo: `streckbase_v2`
- Must be running on port 8080 before using the frontend
- Start backend with `npm run watch` in streckbase_v2

## Notes
- Many deprecated dependencies (old project) — ignore npm audit warnings
- No .env files needed — config is in environment.ts
- Build output: `dist/streckbase/`
