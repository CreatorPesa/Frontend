# Contributing to CreatorPesa Frontend

## Setup

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL, etc.
npm run dev
```

`npm install` also runs `husky` via the `prepare` script, which wires up the pre-commit hook below.

## Before opening a PR

Run these locally — the same checks run in CI, so catching failures here saves a round trip:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

A pre-commit hook already runs lint-staged (ESLint + Prettier on staged files) and a full typecheck on every commit, so most lint/formatting issues never make it that far.

## PR checklist

- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass
- [ ] New components/forms have tests covering validation, the success path, and the API-failure path (see `src/components/dashboard/PayoutRequestForm.test.tsx` for the pattern)
- [ ] New form fields use a `zod` schema in `src/lib/validation/` rather than ad hoc `if` checks
- [ ] Every `<label>` has a matching `htmlFor`/`id` (the shared `Input` component does this for you via `useId()` — hand-rolled `<label>`/`<select>`/`<textarea>` pairs need it added manually)
- [ ] User-facing error messages use `role="alert"` so they're announced to screen readers
- [ ] New data-fetching routes have a `loading.tsx` and `error.tsx` in the same route segment (or inherit one from a parent segment)
- [ ] No new dependency without checking `npm audit` for what it pulls in

## Conventions

- **Validation**: form validation lives in `src/lib/validation/*.ts` as `zod` schemas, parsed with `.safeParse()` in the component's submit handler — not scattered `if` statements.
- **API calls**: every backend call goes through `src/lib/api/*.ts`, which wraps `apiFetch` (`src/lib/api/client.ts`). Don't call `fetch` directly from a component. `apiFetch` aborts after a 15s default timeout, composed with any caller-supplied `AbortSignal` — you don't need to add your own timeout.
- **Server-only secrets**: `NEXT_PUBLIC_*` vars in `src/lib/env.ts` are bundled into the client — never put a secret there. Server-only values (e.g. `OVERLAY_SIGNING_SECRET`) go in `src/lib/env.server.ts` instead, which is only safe to import from server components, route handlers, or `middleware.ts`.
- **Server vs. client components**: default to server components for data fetching; mark a component `'use client'` only once it needs state, effects, or browser APIs. Never pass a function prop from a server component into a client component — lift the state into a client wrapper instead (see `LiveRecentTips.tsx` or `SponsorshipsList.tsx` for the pattern).
- **Error handling**: distinguish "the user isn't authenticated" from "the backend is down" — see the comment in `src/lib/auth/session.ts`. Don't silently swallow errors that should surface as a retryable error state.
- **Comments**: only where the _why_ isn't obvious from the code (a workaround, a non-obvious constraint). Don't restate what a well-named function already says.

## Commit messages

Imperative mood, short summary line, no need for a trailer beyond what's relevant (e.g. a linked issue). Prefer several focused commits over one large one when a change touches unrelated areas.
