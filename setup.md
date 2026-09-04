# Setup

## Requirements

- Node.js 18+
- npm

## Install (once)

```bash
npm run install:all
```

## Run (local)

```bash
npm start
```

- App → http://localhost:5173
- API → http://localhost:5000

## Deploy (Vercel)

1. Push this repo to GitHub
2. Import the repo in Vercel (leave **Root Directory** empty / `.`)
3. Deploy — `vercel.json` builds `client/` and serves `/api`

Do **not** set Root Directory to `client` (API will break).
