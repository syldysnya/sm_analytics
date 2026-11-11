# HLD: system overview

Decisions made so far. Details are added here as each part is agreed.

## Goal

Find gaming creators similar to GripItByTheHusk with bigger audiences, see what works for them on YouTube, TikTok and Twitch, spot trending themes for new content, and keep as much history as possible.

## Data sources: one provider per job

| Job | Provider |
|---|---|
| Discovery: similar creators, gaming trends, keyword search | SocialCrawl |
| Weekly TikTok tracking: profile and recent videos | ScrapeCreators |
| Linking a creator's YouTube, TikTok and Twitch accounts | ScrapeCreators (its YouTube channel call returns the channel's own links) |
| YouTube stats for tracked channels | Official YouTube Data API (free) |
| Twitch stats | Official Twitch Helix API (free); TwitchTracker history imported by hand when wanted |

Instagram and X are out for now.

Each job sits behind its own narrow interface, and config picks the provider that implements it, so a job can move to another provider without touching the rest.

## Config

Hydra, with every setting in `backend/conf/` validated by a structured config schema. Providers, channel lists, limits and paths change in one place.

## Discovery: search themes

Discovery searches only the themes listed in config. Adding or changing a theme is a config edit, not a code change. Each theme has:

- **Search terms:** the games or topics it covers, e.g. World of Warcraft and similar MMOs, or Call of Duty and similar shooters.
- **Platforms:** which of YouTube and TikTok to search.

Finding similar channels takes a **subscriber range** (e.g. 40k–200k or 100k–500k). Only creators inside the range are kept, so results are channels a step or two above mine, not giants.

Every similar channel found is saved to the database with its info (platform accounts, theme, subscriber count, when and how it was found) and given a **channel score** for how well it fits. Channels at or above the score threshold in config become **tracked channels** automatically, with no approval step; the rest are kept as found-but-untracked, so lowering the threshold later can promote them. Each run also writes the untracked channels to a JSON file for manual review (`data/untracked-channels.json`, local only): one entry per channel with its profile URLs on each platform, theme, subscriber count, score and the date it was found. The database stays the source of truth; the file is rewritten from it on every run. To promote a channel after checking it, add its handle to the "always track" list in config; it is tracked from the next run regardless of score. What goes into the score is decided in the LLD. Each weekly run re-collects stats for all tracked channels, so their history starts building from the week they were found. Channels are never deleted, which keeps their history; a channel can be marked inactive to stop collecting it.

Example shape (illustrative, not final):

```yaml
themes:
  wow_and_mmos:
    terms: [world of warcraft, final fantasy xiv, ...]
  cod_and_shooters:
    terms: [call of duty, warzone, battlefield, ...]
  gaming_news:
    terms: [gaming news]
similar_channels:
  subscriber_ranges: [[40_000, 200_000], [100_000, 500_000]]
```

Searches use the APIs' "this week" filter; results are then trimmed to the last 7 days by publish time.

## History

SQLite with append-only weekly snapshots, plus a raw archive of every API response so old weeks can be re-parsed without paying again. Both live in the local, gitignored `data/` folder.

## Site pages

The site has two main pages, both driven by the themes and parameters in config:

1. **Trends:** the videos trending in each configured theme over the last 7 days, refreshed by the weekly run. "Trending" means gaining views fast, not most popular overall:
   - Only videos published in the last 7 days count, so a year-old video with a million views never shows.
   - Videos are ranked by speed: views per hour since publishing, so a 6-hour-old video with 50k views beats a 6-day-old one with 200k.
   - Each video also shows how it did against its own channel's usual views (the outlier score), which separates a small channel's breakout from a big channel's normal upload.
   - No API gives a video's views over time, so speed is an average since publishing. Views gained between runs come only from our own snapshots; with weekly runs the finest step is a week.
2. **Channels:** the channels found for each theme, filtered by the configured parameters (such as subscriber range).

Channel pages are built from video thumbnails and data, no screenshots.

## Runs

Collection is started by hand each week. Scheduled runs may come later, if they are worth paying for.

## Hosting

The frontend is a static site. The backend runs locally and only its exported JSON is deployed.
