# Ledger — a make.fun frontend

[![make.fun bounty: Build the best make.fun frontend](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01)
[![Ledger rank](https://make.fun/badge/makefun-frontend-01/gemblongjos3-cmyk/makefun-ledger/rank.svg)](https://make.fun/bounty/makefun-frontend-01)
[![Ledger reward](https://make.fun/badge/makefun-frontend-01/gemblongjos3-cmyk/makefun-ledger/reward.svg)](https://make.fun/bounty/makefun-frontend-01)

## What it is

A fast, dense, dark ledger-style frontend for make.fun: live bounty board, bounty pages with live-pot rewards tables, leaderboards and public profiles. Built with vanilla JS, no build step, and no framework.

## Routes

- `#/` — bounty board
- `#/bounty/<slug>` — bounty details and rewards
- `#/bounty/<slug>/leaderboard` — bounty leaderboard
- `#/u/<handle>` — public profile

## Performance

First load is only `index.html`, one stylesheet and three small modules. Views load lazily by `import()`. API answers are cached with ETag/If-None-Match revalidation in memory + sessionStorage. The board paginates 10 at a time; leaderboards paginate 25.

## Run it

Run `node serve.ts`, then open http://localhost:8080.

## Hand-in

`MAKEFUN_OUTPUT_DIR=out node main.ts` writes `app/`, `screenshots/` and `dossier.json`.

## License

MIT, see LICENSE.
