# Rooftop Cinema ticket desk

A small Next.js proof of concept for selling rooftop cinema tickets beside an existing Webflow marketing site. It lists sample movies and screenings, takes a general-admission order with optional snacks, and simulates payment.

There is no customer account, dashboard, or real payment. There is no database.

## What it does

1. **Movies** — poster, title, short description, runtime, and screenings.
2. **Screening** — rooftop venue, date, time, ticket price, and seats left.
3. **Tickets and snacks** — ticket quantity and optional snacks. No seating chart.
4. **Checkout** — email, order summary, and total, then a simulated payment.
5. **Confirmation** — movie, venue, screening time, tickets, snacks, total, and a confirmation code.

An order that would exceed the screening’s capacity is refused. Seat counts update in server memory for the life of the running process and reset when that process restarts. On Webflow Cloud, workers do not share this memory, so the check holds within a running instance and is not durable storage.

## Edit the sample data

Movies, screenings, and snacks live in [`data/catalog.ts`](data/catalog.ts). Prices are in cents. Dates are `YYYY-MM-DD`. Times are 24-hour `HH:mm`.

Posters are in [`public/posters`](public/posters). Each movie’s `poster` field is the public path, for example `/posters/moonlight-over-the-hudson.svg`. Replace the file or change that path when you add a new image.

Plain `<img>` tags prefix that path with `NEXT_PUBLIC_BASE_PATH` so it still loads when the app is mounted under a site path.

## Local setup

Requirements for this repo: Node.js 20 or newer and npm. Webflow Cloud builds with **Node.js 22 or newer** and **npm only**. Do not switch this project to pnpm or yarn.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy [`.env.example`](.env.example) to `.env.local` only if you want to try a mount path locally. Leave `NEXT_PUBLIC_BASE_PATH` empty for normal local development. The dev server serves the app from `/`, not from the production mount path.

## Webflow Cloud

Checked against the current [Bring your own app](https://developers.webflow.com/webflow-cloud/bring-your-own-app) guide:

| Requirement | How this app meets it |
| --- | --- |
| Next.js 15 or newer | `next@15.5.27` |
| Node.js 22 or newer on Webflow Cloud | Documented here. Local dev also runs on Node 20. |
| npm only | `package-lock.json`, no other lockfile |
| Do not set `basePath` or `assetPrefix` | Left unset in `next.config.ts`. Webflow Cloud sets them from the mount path at build time and overwrites committed values. |
| Read the mount path at runtime | `NEXT_PUBLIC_BASE_PATH` is prefixed onto poster URLs. `Link` and `useRouter` do not need a manual prefix. |
| Pin the framework if you want | `webflow.json` sets `cloud.framework` to `nextjs` |
| No custom build script required | `npm run build` is for local checks. Webflow Cloud runs its own Next.js build and ignores a custom `build` script. |
| Secrets stay on the server | This demo has no secrets. See below. |

Older Webflow docs say to hard-code `basePath: "/app"` in `next.config`. The current guide says not to. This app follows the current guide.

### Environment variables

| Name | Secret? | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | No. It is inlined into browser JavaScript. | The environment mount path, including the leading slash. Example: `/tickets`. Must match the mount path exactly. Leave empty locally. |

Add it in the Webflow Cloud environment: **Environment variables → Add variable**. Do not mark `NEXT_PUBLIC_BASE_PATH` as secret.

If you add a real provider later, put its key in a server-only variable, mark that variable **Secret**, and read it from a server action or route handler. Never give a secret a `NEXT_PUBLIC_` name.

### Deploy onto the marketing site

The app is meant to be mounted on the existing Webflow site, so the marketing pages and this ticket desk share a domain.

1. Push this repository to GitHub.
2. In Webflow, open the workspace and choose **New project → App**.
3. Import this GitHub repository and select the branch to deploy.
4. Choose **Existing site**, pick the rooftop cinema marketing site, and set a mount path such as `/tickets`.
5. Add `NEXT_PUBLIC_BASE_PATH` with that same path, for example `/tickets`.
6. Deploy. The first build can take a couple of minutes.
7. If the marketing site has never been published, publish it. The mounted app is available at `your-domain/tickets` after that.

You can also deploy from the CLI. `webflow auth login` writes `WEBFLOW_API_TOKEN` to a `.env` file in this folder. That file is gitignored. Do not commit it, and do not put that token in `NEXT_PUBLIC_BASE_PATH` or any other browser variable.

```bash
npm install -g @webflow/webflow-cli
webflow auth login
webflow cloud deploy
```

On the first deploy, choose the existing marketing site and the mount path.

A push to the connected branch deploys again. Webflow Cloud does not use a database for this app, and there is no `wrangler.json`, because orders are simulated in memory.

### If posters or pages 404 after deploy

- The marketing site has been published, and the latest Cloud deployment succeeded.
- `NEXT_PUBLIC_BASE_PATH` matches the mount path, with a leading slash and no trailing slash.
- `basePath` is still unset in `next.config.ts`.
- Poster files exist in `public/posters` and the `poster` path in `data/catalog.ts` matches the filename.
