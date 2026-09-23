# Recipe Book

A Next.js App Router + TypeScript assignment backed by Neon PostgreSQL. Visitors can search recipes, open recipe details, and save recipes with personal notes in a browser-specific cookbook. The instructor's recipe schema and data are preserved.

## Setup

1. Use Node.js 22.18+ (needed by the TypeScript unit tests) and install dependencies with `npm ci`.
2. Create a Neon project and copy its PostgreSQL connection string into `PG_URI` in `.env.local`. Use `.env.example` as a template. Keep `sslmode=require` in the connection string.
3. Run `npm run db:setup`. This imports `sql/start.sql` only when the recipes table is missing or empty, then applies `sql/001-cookbook.sql`. Existing recipes and notes are preserved. The seed file is the instructor-provided SQL, unchanged; do not repeatedly run its INSERT statements manually.
4. Run `npm run dev` and visit http://localhost:3000.

`.env.local` is ignored by Git. Never commit or paste real connection strings, and never expose `PG_URI` through a `NEXT_PUBLIC_` variable. Database helpers import `server-only` and use parameterized Neon queries.

## Routes and data flow

| Route | Purpose |
| --- | --- |
| `/` and `/?q=Italian` | Server-rendered frontend with case-insensitive title/category search in Neon |
| `/recipes/[id]` | Fetch one recipe by ID; invalid/missing IDs show the not-found page |
| `/cookbook` | List saved recipes, edit/clear notes, remove recipes |
| `GET /api/recipes?q=Italian` | Search recipes in Neon for client consumers |
| `GET /api/recipes/[id]` | Fetch recipe JSON by ID |
| `GET /api/cookbook` | Return this visitor's saved recipes with notes |
| `POST /api/cookbook` | Save `{ "recipeId": 1 }`; repeated saves preserve existing notes |
| `PATCH /api/cookbook/[id]` | Update `{ "notes": "Try more garlic" }`; empty text clears notes |
| `DELETE /api/cookbook/[id]` | Remove a saved recipe, leaving the recipes table unchanged |

Writes use JSON and the `X-Cookbook-Request: 1` header. Invalid input returns 400, rejected cross-origin writes return 403, missing recipes/entries return 404, and database failures return a generic 503 message. Successful writes return `{ "success": true }`. Cookbook responses are private and not cached. Submit the existing navbar search with Enter or its search icon; the query is stored in the URL.

The first successful save creates a random HttpOnly cookie (`Secure` in production, `SameSite=Lax`, one-year lifetime). Neon stores its hash as `visitor_id`. Every cookbook query scopes to that visitor, with a unique `(visitor_id, recipe_id)` key. No visitor token or identifier is accepted in a JSON body or returned in cookbook data. This is an anonymous, browser-specific cookbook: clearing cookies or changing browser loses access to those saved entries. It does not provide cross-device accounts or login. The instructor's package exploration mentions Neon Auth, but the supplied functional requirements do not require account authentication; the pre-existing auth dependency is left in place.

## Frontend handoff and folders

- `src/app`: App Router pages, loading/error/not-found boundaries and API routes.
- `src/components`: the teammate’s existing screens plus working cookbook forms and save button. The shared React Query provider lives in `src/app/provider.tsx`. Your frontend teammate can style or reorganize these controls without changing the API.
- `src/utils`: server-only database queries, visitor handling, validation and client mutation hook.
- `src/types`: `Recipe` and `CookbookEntry` shapes.
- `sql`: original instructor seed and additive cookbook migration.
- `scripts`: repeatable database setup.
- `tests`: input validation and live API integration checks.

`useCookbookMutation` uses TanStack React Query `useMutation` for all three write operations, serializes writes in the client, and invalidates the cookbook query after success. Forms display pending, success and error feedback. Server-rendered pages use `loading.tsx`, `error.tsx` and `not-found.tsx`. The installed Next.js version uses `retry()` in error boundaries.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

With a running local server and database setup completed:

```bash
TEST_BASE_URL=http://localhost:3000 npm run test:integration
```

The integration test uses a fresh visitor cookie, checks browsing/search, duplicate saves, note editing/clearing, deletion, validation and visitor isolation, then removes its own saved entry. It defaults to instructor recipe ID 1; set `TEST_RECIPE_ID` if necessary. It refuses non-local servers. No instructor recipes are modified.

Manually check the save button, cookbook notes form, pending states and retry controls in a browser. For database failure feedback, temporarily use an invalid local PG_URI and restart the development server, then restore the original configuration. Do not commit credentials.

## TypeScript roadmap

Implemented: shared recipe/cookbook type aliases, typed asynchronous route parameters, a discriminated union for cookbook writes, a generic fetch helper, and runtime narrowing for incoming IDs/notes. Database timestamps are represented as JSON strings (recipe `created_at` may be null, matching the original schema). Future frontend work can reuse these types for styled cards and forms. Add types when they clarify actual data; enums or extra abstractions are not required for this backend.

## Collaboration and deployment

The local backend branches are organized for dependent feature PRs: `feature/recipe-details` → `dev`, `feature/recipe-search` → `feature/recipe-details`, `feature/cookbook-crud` → `feature/recipe-search`, and `chore/backend-setup-tests` → `feature/cookbook-crud`. These backend PRs have not been opened yet. Review in this order. After merging each predecessor into `dev`, retarget the next PR to `dev` (and update its branch if using squash merges). Keep branches until dependent PRs are retargeted. Merge into `main` only through a reviewed PR. The final branch contains the whole integrated app and preserves the frontend already merged into `dev`. Final deployment remains a team task.

For the instructor's Vercel deployment requirement, import the repository, select Next.js, configure `PG_URI` for the appropriate environments, and run database setup against the intended Neon database before deploying. Verify recipe detail URLs and cookbook writes on the deployed HTTPS domain. A static export cannot run these database routes. Builds may need internet access for the existing Google fonts. Never use a production database for destructive testing.

## Instructor references

- [Project requirements](https://github.com/E-SEAI-008/recipe-book/blob/main/recipe-book.md)
- [Next.js path](https://github.com/E-SEAI-008/recipe-book/blob/main/recipe-book-nextjs-path.md)
- `sql/start.sql` is copied from the instructor SQL attachment supplied in the project discussion.

## Backend scope review

The backend keeps the instructor recipe SQL unchanged, server-side title/category search, recipe detail reads, visitor cookbook CRUD, React Query mutations, input validation and database loading/error feedback. The existing frontend design belongs to the teammate; only data wiring, recipe links and basic cookbook controls are included here. The visitor cookie is an implementation of separate visitor cookbooks, not an account/login feature.

No unsupported product features were found in the previous backend commits, so none were removed. Existing frontend dependencies and components are preserved. `pg` supports the transactional SQL setup script; runtime recipe and cookbook queries use `@neondatabase/serverless`. The pre-existing `@neondatabase/auth` package remains available for the instructor's exploration, without implementing authentication.

Vercel deployment and the mandatory presentation remain team deliverables. Deployment has not been performed or production routes verified in this backend task.
