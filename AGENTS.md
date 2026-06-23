# Gopher Gains Frontend — Agent Context

## Project
Angular 22 standalone + Tailwind CSS v3. Gym workout tracker. No NgModules.
Single repo: Go backend at root, Angular in `gopher-gains-front/`.

## Quick Start
```bash
cd gopher-gains-front
npm start          # dev server on :4200 (generates env, --poll 2000 for WSL)
npm run build      # production build
```

## Routes
| Path | View | Role |
|---|---|---|
| `/` | Redirect → `/admin` | — |
| `/admin` | Admin dashboard | admin |
| `/my` | User dashboard | user |
| `/exercises` | List all exercises | any |
| `/exercises/new` | Create exercise | admin |
| `/routines` | List all routines | any |
| `/sessions` | List all sessions | any |
| `/sessions/new` | Create session | any |
| `/users` | List users | admin |
| `/assignments` | Assign routines to users | admin |

## Role System (Client-side only)
No backend auth. Role derived from URL path:
- `AuthService.currentRole` signal defaults to `'admin'`
- `NavigationEnd` → `/my` → `'user'`, `/admin` → `'admin'`
- Sidebar: `adminOnly` items (Users, Assignments) hidden for users

## Architecture
- `core/services/auth.service.ts` — role state
- `core/services/sidebar.service.ts` — sidebar open/close
- `shared/services/toast.service.ts` — auto-dismiss toasts (3s)
- `shared/safe-html.pipe.ts` — SVG icons via DomSanitizer
- `shared/icons.ts` — all SVG icon constants
- `shared/components/` — Card, EmptyState, ErrorMessage, LoadingSpinner, ConfirmDialog, Toast
- `features/dashboard/` — two views (admin / user) via `@if (auth.currentRole() === 'admin')`

## Design
- Warm chalk palette (`#F5F2ED` surface), burnt orange accent (`#E87D2F`)
- DM Sans (display) + Inter (body) — see `DESIGN.md`
- Sidebar: 220px (`w-sidebar`), responsive overlay on <1024px
- The Single Accent Rule, The Display-Is-A-Weight Rule, The Flat-By-Default Rule

## API
- Base: `http://localhost:8080/api/v1` (from `.env`)
- Response: `{ status, data, meta: { page, perPage, pageCount, totalCount } }`
- No auth, no DELETE endpoints, no login
- All entities use camelCase JSON (Meta struct in Go was fixed to camelCase)

## Build Notes
- `tsconfig.app.json` has `rootDir: "./src"` — required for TS 5.5+
- `tailwind.config.js` has custom `sidebar: '13.75rem'` spacing token
- PostCSS v8 (Tailwind v3), not v4 (incompatible with Angular 22 Vite build)
- `"type": "module"` in package.json for ES module scripts

## User Model
```ts
export type UserRole = 'admin' | 'user';
export interface User {
  id: number; name: string; lastName: string; email: string;
  role?: UserRole; createdAt: string; updatedAt: string;
}
```

## What's Missing (Future Work)
- Quick-log set entry during active session (core interaction)
- Backend auth / real role enforcement
- Keyboard shortcuts for fast set logging
- Session resume from dashboard
- DELETE endpoints (missing from backend)
