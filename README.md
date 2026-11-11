# Social media analytics for gaming channels

Find creators similar to GripItByTheHusk with bigger audiences, see what works for them on YouTube, TikTok and Twitch, spot trending themes for new content, and keep as much history as possible.

## Layout

| Folder | What |
|---|---|
| `backend/` | Python: collectors, history database, analysis, export to JSON for the site |
| `frontend/` | Vite + React + TypeScript + MUI + Redux Toolkit (RTK Query) site; reads the exported JSON from `frontend/public/data/` |
| `data/` | Local only, gitignored: `history.sqlite` and `raw/` (every API response, compressed). Back it up separately. |

## Design

High-level designs are in [`docs/hld/`](docs/hld/), starting with the [system overview](docs/hld/system-overview.md). Low-level designs go in `docs/lld/`.
