# Social media analytics for gaming channels

Find creators similar to GripItByTheHusk with bigger audiences, see what works for them on YouTube, TikTok and Twitch, spot trending themes for new content, and keep as much history as possible.

## Layout

| Folder | What |
|---|---|
| `backend/` | Python: collectors, history database, analysis, export to JSON for the site |
| `frontend/` | Vite + React + TypeScript + MUI + Redux Toolkit (RTK Query) site; reads the exported JSON from `frontend/public/data/` |
| `data/` | Local only, gitignored: `history.sqlite` and `raw/` (every API response, compressed). Back it up separately. |

## Decisions

- **Sources:** YouTube via the official Data API; TikTok via a paid scraper API (SocialCrawl or ScrapeCreators, picked after a side-by-side test on free credits); Twitch via the official Helix API, with TwitchTracker history imported by hand when wanted. Instagram and X are out for now.
- **Discovery and trends:** from the scraper API's search, trending and similar-creator endpoints, not the YouTube API.
- **History:** SQLite with append-only weekly snapshots, plus a raw archive of every API response so old weeks can be re-parsed.
- **Channel pages:** built from video thumbnails and data, no screenshots.
- **Runs:** collection is started by hand each week; when I will feel like paying then maybe.
- **Hosting:** the frontend is a static site. The backend runs locally and only its exported JSON is deployed.
