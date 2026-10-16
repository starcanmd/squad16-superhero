# Squad 16 · Superhero View Lab dashboard

Next.js app with three views. Lab overview is public. My view and Leader view open after a Stanford email check that runs on the server, so VC-side people never receive the co-founder pack and vice versa.

## Deploy to Vercel (one time)

```
cd superhero-dashboard
npx vercel --prod
```

Accept the defaults. Vercel detects Next.js. The URL it prints is the one to share with the squad.

Redeploy after any edit with the same command.

## Shared storage (needed for the Team Assessment and checklists)

Submissions and checklist ticks are stored server side so the squad sees one consolidated result. On Vercel this needs a Redis store. Two clicks, no code.

1. Open the project in the Vercel dashboard, go to the Storage tab, choose Upstash (Redis), click Create and connect it to the project. Vercel adds the `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars automatically.
2. Redeploy with `npx vercel --prod`.

Until this is done the site still works, but the Results tab shows a warning and submissions are not kept between visits.

## Where things live

- `lib/public.ts` Agenda, prep tasks, roster. Visible to anyone.
- `lib/content.ts` Emails, roles, leadership goals, behaviors to try, and the case packs. Served only through `/api/pack`.
- `app/api/pack/route.ts` The email check.

## Adding the co-founder case

Open `lib/content.ts` and replace the placeholder in `COFOUNDER_PACK` with sections in the same shape as `VC_PACK` (heading plus paragraphs or bullets). Redeploy.

## Changing an email or a role

Edit the matching entry in `PEOPLE` in `lib/content.ts`. Round assignments in the public roster are in `ROSTER` in `lib/public.ts`.

## Local run

```
npm install
npm run dev
```
