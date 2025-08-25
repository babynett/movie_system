
# Copilot Instructions for Movie System

## Project Overview

- **Type**: Full-stack movie review and recommendation system
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: JWT tokens, bcrypt password hashing
- **External API**: TMDB for movie data

## Architecture & Patterns

- **App Directory**: Next.js 15 `/app` directory for routing/layouts. Pages and API routes in `src/app/`.
- **Context Providers**: `src/app/context/` for Auth and Favorites (global state, e.g. `FavoritesContext.tsx`).
- **API Layer**: All backend logic in `src/app/api/` (RESTful, feature-based folders: `auth`, `movies`, `favorites`, `friends`).
- **Database**: All DB access via Prisma (`lib/db.ts`, `prisma/schema.prisma`).
- **Component Structure**: UI/logic components in `src/components/`, grouped by feature (`main_components`, `auth`, `ui`).
- **Docs**: Feature/implementation docs in `docs/` (see `docs/Implementation/implementation-documentation.md`).

## Developer Workflows

- **Install dependencies**: `npm install`
- **DB setup**: `npx prisma generate` & `npx prisma db push`
- **Start dev server**: `npm run dev` (http://localhost:3000)
- **View DB**: `npx prisma studio`
- **Env setup**: Set secrets in `.env.local` (see `README.md`)

## UI/UX & State Management

- **Favorites, Notes, Comments, Chat**: Use React context for favorites; use `localStorage` for notes/comments/chat (see `MovieNotes.tsx`, `MovieComments.tsx`, `ChatRoom.tsx`).
- **Loading/Error States**: Always provide user feedback (spinners, error messages, e.g. in `Movies.tsx`).
- **Modal/Tabbed UI**: Use modal for movie details (`MovieDetailsModal.tsx`), tabs for details/notes/comments.
- **Navigation**: Enhanced via `Navbar.tsx`, "Full Details" buttons, and chat link.
- **Styling**: Tailwind CSS utility classes; global styles in `src/app/globals.css`.

## Project-Specific Conventions

- **API endpoints**: All under `/api/` (see `src/app/api/`). Use RESTful, feature-based folders.
- **Component naming**: PascalCase for components, camelCase for hooks.
- **TypeScript**: Use explicit types for all data structures (see `Movie`, `Note`, `Comment`, `Message` in main_components).
- **Persistence**: Use `localStorage` with key patterns (e.g. `movie_notes_${movieId}`) for client-side data.
- **Error Handling**: Always set error state and show user-friendly messages.

## Integration Points

- **TMDB API**: All movie data fetched via TMDB. API key required in env. Use dynamic import for axios to avoid SSR issues (see `Movies.tsx`).
- **Prisma**: All DB access via Prisma client. Schema in `prisma/schema.prisma`.
- **JWT**: Auth logic in `lib/auth.ts` and API routes.

## Examples

- **Add API route**: Place handler in `src/app/api/[feature]/[action]/route.ts`.
- **Add page**: Place in `src/app/views/[feature]/[page].tsx`.
- **Add context**: Place in `src/app/context/` and wrap in `layout.tsx` as needed.
- **Add feature**: Follow component structure, use localStorage for client-side persistence, add loading/error states, ensure responsive design.

## References

- See `README.md` for setup, workflows, and API endpoint list.
- See `docs/Implementation/implementation-documentation.md` for feature/implementation details.
- See `prisma/schema.prisma` for DB structure.

---

If unsure about a pattern or workflow, check the `README.md`, `docs/`, or relevant files in `src/app/`.
