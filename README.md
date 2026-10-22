# NextSpeak — Free Beginner English Lessons (PWA)

NextSpeak is a mobile-friendly Progressive Web App for learning beginner English. It ships with a
4-week lesson program turned into **6 complete lessons**, each with vocabulary, examples, and an
**interactive quiz** with instant feedback. Progress is saved locally in the browser — no accounts,
no server, no tracking.

The site is a **fully static Next.js 14 export** (`out/` folder) designed to be deployed to
**Vercel via GitHub** in a couple of clicks.

## Features

- **Home page** — course overview and clear calls to action.
- **Lessons list** — 6 beginner lessons organized by week, with overall progress.
- **Lesson pages** — explanations, vocabulary tables, and example sentences for each topic.
- **Interactive quizzes** — 5 multiple-choice questions per lesson, instant right/wrong feedback
  with explanations, question recap, and a **70% pass mark** that automatically completes the
  lesson.
- **Progress tracking** — scores, attempts, and completion are stored in `localStorage`
  (`nextspeak-progress-v1`), with a progress dashboard, per-lesson reset, and full reset.
- **PWA** — installable on Android, iOS, and desktop; works offline after the first visit
  (see [Offline limitations](#pwa--offline-limitations)).
- **Responsive UI** — works on phones, tablets, and desktops; respects reduced-motion settings
  and includes accessibility basics (skip link, landmarks, focus states, ARIA live regions).
- **English UI throughout**, based on the original “One-Month English Study” 4-week program:

  | Week | Lessons |
  |------|---------|
  | 1 | Greetings and Introductions · Daily Routines and the Present Simple |
  | 2 | Describing People · Places in Town |
  | 3 | Talking About the Past |
  | 4 | Plans for the Future (with a course review) |

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**, static export (`output: 'export'`)
- **Tailwind CSS** + the existing UI kit (`src/components/ui/*`)
- Hand-written **service worker** (`public/sw.js`) — no extra PWA dependencies
- No backend, no databases, no external APIs, **zero required environment variables**

## Local development

Requirements: **Node.js 18+** and npm.

```bash
cd nextspeak-platform
npm install
npm run dev        # http://localhost:3000
```

Build and checks:

```bash
npm run type-check   # TypeScript, no emit
npm run lint         # ESLint
npm run build        # Production static export → out/
npm run preview      # Serve the out/ build locally (http://localhost:4173)
```

> `npm run build` is the only command Vercel runs; it must pass with **no errors**.
> The exported site lives in **`out/`** — never edit files there, they are regenerated on every build.

## Project structure

```
nextspeak-platform/
├── public/
│   ├── sw.js               # Hand-written service worker (offline caching)
│   ├── offline.html        # Offline fallback page
│   ├── site.webmanifest    # PWA manifest (name, icons, colors, standalone)
│   └── icon-*.png          # PWA icons (72–512 px), favicon, og-image
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home
│   │   ├── lessons/page.tsx            # Lessons list
│   │   ├── lessons/[slug]/page.tsx     # Lesson detail
│   │   ├── lessons/[slug]/quiz/        # Quiz runner
│   │   ├── progress/page.tsx           # Progress dashboard
│   │   ├── layout.tsx, providers.tsx   # Root layout, PWA + progress providers
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── QuizRunner.tsx              # Interactive quiz (feedback, recap, scoring)
│   │   ├── ProgressProvider.tsx        # localStorage progress state
│   │   ├── LessonProgressPanel.tsx     # Lesson progress widget
│   │   ├── ServiceWorkerRegister.tsx   # Registers public/sw.js
│   │   ├── InstallAppButton.tsx        # PWA install prompt
│   │   └── ui/, layout/                # Design system, Header, Footer
│   ├── content/lessons.ts              # ★ ALL lesson + quiz content
│   └── lib/progress.ts                 # Progress storage logic, PASSING_SCORE = 70
├── next.config.js        # output: 'export' (static site)
├── vercel.json           # buildCommand: next build (Output Directory stays at the Next.js default)
├── .env.example          # Optional variables (none required)
└── supabase-schema.sql   # Legacy reference only (see below)
```

## Adding or editing lessons

All content lives in **`src/content/lessons.ts`** — no other file needs to change:

1. Add or edit an entry in the `lessons` array (title, week, slug, summary, sections/vocabulary,
   and quiz questions).
2. Each quiz question is type-checked at compile time: exactly 4 `options` and a
   `correctIndex` of `0 | 1 | 2 | 3`.
3. Run `npm run build` — new lesson pages and quiz pages are generated automatically from the
   `slug`.

The pass mark (`70`) and the storage key are defined in `src/lib/progress.ts`.

## Progress & privacy

- Progress is stored **only in the learner's browser** (`localStorage`, key
  `nextspeak-progress-v1`). Nothing is sent anywhere.
- Clearing browser data deletes progress; each lesson can be reset individually or all at once
  from the **Progress** page.
- Because storage is per-device, the same learner on a different phone or browser starts fresh.

## PWA — offline limitations

The app is installable (manifest + service worker) and caches pages for offline use.

**What works offline:** already-visited pages and lessons (served from cache), quizzes already
loaded, and a branded `offline.html` fallback.

**What does NOT work offline:**

- A lesson or quiz page that was **never visited** on that device (nothing new can be downloaded).
- Automatic updates while offline — new deploys are picked up on the next visit with a connection
  (the service worker refreshes its cache on each successful load).
- iOS Safari shows “Add to Home Screen” but limits service-worker lifetime; results vary.

No push notifications, no background sync, and no analytics are included.

## Environment variables

**None required.** The optional `.env.example` documents:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | No | Canonical URL used for SEO/social-share metadata. Defaults to `https://nextspeak-platform.vercel.app`. |

`.env.local` is git-ignored. Never commit secrets.

## Deploy — GitHub + Vercel (exact steps)

### 1. Push the project to GitHub

If you haven't created a repository yet, create an empty one on GitHub (no README), then run:

```bash
cd nextspeak-platform
git remote add origin https://github.com/YOUR-USERNAME/nextspeak-platform.git
git branch -M main
git push -u origin main
```

(All files are already committed locally — `git add .` + `git commit -m "..."` if you have new
changes to push.)

### 2. Import the repository in Vercel

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Select the **nextspeak-platform** repository → **Import**.
3. Vercel auto-detects **Next.js**; `vercel.json` already sets the **Build Command** to
   `next build`. Leave all settings as-is (the Output Directory must stay at the Next.js
   default — do **not** point it to `out`; Vercel's builder detects the static export itself).
   No environment variables need to be added.
4. Click **Deploy**. Wait for the build to finish (≈1 minute).

### 3. Done

- Your site is live at `https://nextspeak-platform-<account>.vercel.app` (or the name you chose).
- Optional: set `NEXT_PUBLIC_APP_URL` to your final URL under
  **Project → Settings → Environment Variables**, then redeploy, so social-share metadata points
  to the production domain.
- Optional: add a custom domain under **Project → Settings → Domains**.

Every push to `main` now triggers a new production deployment automatically.

## Legacy full-stack version

This repository originally contained a full-stack platform (Supabase auth, teacher tokens,
certificates, courses). That version is **preserved in the first git commit** (`9394f06`) together
with `supabase-schema.sql` and `types/index.ts` kept as reference material. The current app does
**not** use Supabase, API routes, or authentication in any way.

## Support

- Email: contacto@nextspeak.com
- Created by **Oldemar Almengor**, English teacher.
