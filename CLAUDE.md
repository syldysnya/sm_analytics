# Social media analytics for gaming channels: rules for this repo

Universal coding rules in `~/.claude/coding-rules.md` apply. This file adds what is specific to this repo; it wins on conflict.

- Read `README.md` (layout) and `docs/hld/system-overview.md` (decisions) first.
- **Design docs:** high-level designs in `docs/hld/<topic>.md`, low-level designs in `docs/lld/<topic>.md`, one topic per file, named by topic in kebab-case (e.g. `docs/lld/tiktok-tracking.md`). A new decision goes into the matching doc in the same change.
- **Backend** (`backend/`): Python 3.12, hatch, src layout (`src/gaming_social_analytics`). Gate: `hatch run check`.
- **Frontend** (`frontend/`): Vite + React + TypeScript, MUI for all UI components (theme in `src/theme.ts`), Redux Toolkit for state, static build only.
  - All data loading goes through RTK Query: `src/store/dataApi.ts` reads the exported JSON from `public/data/`. A feature adds its endpoints with `dataApi.injectEndpoints` beside its own code, not by editing `dataApi.ts`. No `fetch` in components.
  - Use the typed hooks `useAppSelector` / `useAppDispatch` from `src/store/store.ts`. Gate: `npm run lint && npm run typecheck && npm run build`.
- **Data never goes in git.** `data/` (SQLite history and raw API archive) is local and gitignored; only exported JSON in `frontend/public/data/` is committed.
- **History is append-only.** A collection run adds snapshot rows; it never edits or deletes earlier weeks.
- **Keep every raw API response** in `data/raw/` before parsing, so fields can be re-read later without paying again.
- **Each external data provider sits behind one narrow interface** so it can be swapped (the TikTok provider is not final).
- **Never push directly to `main`.** Every change goes on its own branch and lands through a pull request.
