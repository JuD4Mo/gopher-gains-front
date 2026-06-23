# Product

## Register

product

## Users

Two roles sharing the same interface, with different visible surfaces:

- **Admin** (one or more): Creates default routines (e.g. PPL, Push/Pull/Legs), manages the exercise catalog, and oversees users. Sees everything: dashboard, exercises, routines, users, sessions, assignments.
- **Regular user**: Tracks their own gym progress. Browses the exercise catalog, picks from existing (or creates custom) routines, logs workout sessions with sets/reps/weight/RIR. Does NOT see the Users tab or admin-level assignment features.

Primary context: a person at the gym or at home tracking their workout in real time — recording sets between exercises, checking their routine's exercise list, logging weight and reps.

## Product Purpose

Gopher Gains lets people track their strength training progress. Instead of carrying a notebook or relying on memory, users log each workout session: which exercises they did, with what weight, reps, and how close to failure (RIR). Default routines (created by admins) give new users a starting point without needing to build everything from scratch.

## Brand Personality

Robusta, amena, intuitiva — strong and grounded like iron, warm like chalk dust, intuitive enough to use between sets without friction.

## Anti-references

- Generic SaaS dashboards (grey/blue, corporate, forgettable)
- Overly gamified fitness apps (badges, streaks, social features)
- Dark, aggressive "beast mode" gym aesthetics
- Card-heavy grids where every card looks identical

## Design Principles

1. **Invisible hierarchy** — surfaces, borders, and spacing should guide the eye without announcing themselves. The craft disappears; the data leads.
2. **Purposeful color** — one warm accent (burnt orange) carries emphasis. No decorative gradients or unmotivated color.
3. **Domain-grounded** — the palette and texture come from the gym world: chalk, iron, well-worn surfaces. Not from "modern dashboard" templates.
4. **Respect the set** — the core interaction (logging a set) must be fast and obvious. Every UI decision serves that flow.
5. **Progressive disclosure** — admins see the full toolset; regular users see only what they need. The interface adapts to who's using it.

## Routing & Role Architecture

Two role-based routes, no auth yet — role is derived from the URL path:
- `/admin` — Admin dashboard with full stats (exercises, routines, users, sessions), Quick Actions (New Exercise, New Routine, New User, New Session), and Overview with assignments link
- `/my` — User dashboard with personal stats (My Sessions, Assigned Routines, Exercises Available), Recent Sessions list, My Routines list, and simplified Quick Actions (Start a Session, Browse Exercises)
- `/` — Redirects to `/admin`

`AuthService` (in `core/services/auth.service.ts`) tracks `currentRole` as a signal. It syncs from URL on `NavigationEnd`: if path starts with `/my` → `'user'`, else if starts with `/admin` → `'admin'`. On non-dashboard pages the role is preserved (not reset).

Sidebar filters nav items by role using a `computed` signal. Items with `adminOnly: true` (Users, Assignments) are hidden when `currentRole === 'user'`. The Dashboard link points to `/admin` or `/my` depending on the current role.

**Note:** Backend has no auth, no login, no JWT. Roles are hardcoded client-side for now. When auth is implemented, the redirect from `/` should use the user's real role instead of defaulting to admin.

## Future: Quick Log & Micro-interactions

The core interaction (logging a set during a workout) is not yet implemented. Planned patterns:
- Quick-log: fast inline set entry during an active session, no page navigation
- Keyboard shortcuts for fast set logging (tab between weight/reps/RIR, enter to submit)
- Session resume from dashboard recent sessions list

## Known Technical Details

- **Dev server**: `npm start` from `gopher-gains-front/` (runs `env:generate` then `ng serve --poll 2000`). Polling needed for WSL file system watch to work.
- **Build**: `npm run build`. `tsconfig.app.json` has `rootDir: "./src"` to fix TypeScript output layout error.
- **API base URL**: Configured in `.env` as `NG_APP_API_URL=http://localhost:8080/api/v1`. Generated to `src/environments/environment.ts` via `tools/env-to-ts.mjs`.
- **Backend**: Go on port 8080. No auth. Response format: `{ status: 200, data: [...], meta: { page, perPage, pageCount, totalCount } }` with camelCase keys.

## Accessibility & Inclusion

No specific requirements at this stage. Standard WCAG AA contrast ratios and keyboard navigation apply.
