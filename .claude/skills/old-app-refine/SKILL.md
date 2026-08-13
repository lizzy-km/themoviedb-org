---
name: old-app-refine
description: Modernize a stale/legacy React (or similar) frontend end-to-end — audit, then rebuild with current tooling, feature-based folders, proper data-fetching, custom UI components, and responsive UI/UX. Use when the user says the codebase is "outdated", "needs modernizing", "full rewrite", or asks to replace legacy state management (Context/Redux) with React Query + Zustand, split up a mega-component, or fix broken responsive design across an old app.
---

# Old App Refine

A playbook for taking a stale, organically-grown frontend (God context,
copy-pasted JSX, no types, broken responsiveness) to a modern, typed,
feature-organized codebase — without losing scope, without silently cutting
corners, and with proof it actually works at the end.

This skill assumes a React app but the phases generalize to any frontend
framework: audit → clarify → foundation → UI kit → features → routing →
verify → commit-as-you-go.

## Phase 0 — Audit before touching anything

Read before writing a single line. Use Explore/general-purpose agents for
breadth if the codebase is large, but read the following yourself:

- `package.json` (deps, scripts) — note dead/unused libraries and version
  drift
- Entry point (`main.jsx`/`main.tsx`, `App.jsx`) and router setup
- The state layer (Context providers, Redux store, etc.) in full — this is
  usually where the worst problems live (state mutated during render, effects
  with wrong dependencies, hardcoded secrets)
- Every page/route component
- A sample of "shared" components to spot copy-paste duplication
- CSS/style setup (global stylesheet, Tailwind config, CSS-in-JS)
- `.env` / `.gitignore` — check whether secrets are tracked in git history

Build a concrete defect list with file:line references, not vague
impressions. Look specifically for:

- **Secrets committed to source or tracked `.env` files**
- **`setState` called during render** (not inside an effect/handler) — causes
  render loops or React 18 warnings
- **`useEffect` with missing/wrong dependencies**, especially ones that
  refetch on every render
- **Reads implemented as mutations** (e.g. `useMutation` used for GET
  requests) — no caching, no dedup
- **Copy-pasted JSX blocks** repeated across 3+ files — a sign a shared
  component is missing
- **UI state stored as class-name strings** in `useState` instead of a proper
  enum/boolean — brittle and hard to keep in sync
- **Route params with no type/media-type disambiguation** (e.g. one path
  param used for two different entity kinds)
- **Global CSS that hides scrollbars or applies `transition` to `*`** —
  accessibility and performance smells
- **Hardcoded `http://` asset URLs, missing null-checks on optional fields**
  (broken images, `.slice()` on undefined)
- **No error boundaries, no loading states, no 404 handling**

Report the audit as a short, direct list (this reads well as prose, not a
table) before proposing any plan.

## Phase 1 — Clarify scope with AskUserQuestion

A full rewrite touches nearly everything; a few choices change the shape of
the entire effort. Ask up front, batched into one AskUserQuestion call:

1. **Language**: stay in JS or migrate to TypeScript? (Recommend TS if the
   audit found type-shaped bugs — undefined field access, wrong param types.)
2. **Delivery shape**: full rewrite in place vs. incremental/foundation-first.
   (Full rewrite is fine when git history preserves the old code as a
   fallback — say so explicitly to make the "in place" choice feel safe.)
3. **Secrets handling**: if the audit found a committed/hardcoded key —
   client-side with env vars (simplest, still visible in the bundle) vs. a
   proxy/serverless layer (more secure, more setup). Flag that any
   `VITE_`-style var is inlined into the bundle regardless.
4. **Feature scope**: parity-only vs. parity plus specific additions
   (favorites/watchlist-style persistence, dark mode, media galleries,
   whatever the domain suggests). Offer a "core parity" recommended option
   plus 2-3 concrete add-ons as a multiSelect.

Don't guess on these — they change file counts, dependency choices, and
review scope materially.

## Phase 2 — Foundation (one commit)

Before any feature code:

1. **Toolchain**: package.json deps (drop every library the audit flagged as
   dead weight — UI kits being fully replaced, unused state libraries,
   oversized utility libraries where 10 lines of native code suffice), strict
   tsconfig (`strict`, `noUncheckedIndexedAccess`), path alias (`@/*`), ESLint
   flat config.
2. **Vite/bundler config**: path alias resolution, vendor chunk splitting.
   **Check for a stale sibling config file** (e.g. an old `vite.config.js`
   next to a new `vite.config.ts`) — bundlers prefer `.js` and will silently
   ignore your new config's aliases. This is a real, easy-to-miss failure
   mode; grep for it explicitly.
3. **Secrets**: untrack any committed `.env`, gitignore it, write `.env.example`
   with placeholder values and a comment explaining the bundle-visibility
   caveat. If a live/valid credential is found, treat it as compromised and
   flag rotation to the user — don't just quietly swap the variable name and
   move on.
4. **Design tokens**: CSS variables for a light/dark palette resolved via
   `prefers-color-scheme` + an explicit override attribute (not a
   `.dark` class toggle alone — that fights `prefers-color-scheme` on first
   load). Drop any global `* { transition: ... }` or scrollbar-hiding rules
   found in the audit.
5. **Typed data layer**: one fetch client (timeout + abort composition, typed
   error class with a `retryable` flag), full response type models
   (nullable fields typed nullable — this is where "broken image" bugs come
   from), hierarchical query keys, and framework-idiomatic read hooks
   (`useQuery`/`useInfiniteQuery`, not mutations-for-reads).

Typecheck, then commit. Don't let the foundation commit balloon into feature
work.

## Phase 3 — Custom UI kit + state stores (one commit)

If the user opted out of a UI library:

- Build primitives from scratch: Button, Input, Select, Badge, Modal (real
  focus trap + scroll lock + Escape + focus restoration — don't skip this,
  it's cheap and the old app never had it), Skeleton, Tabs (full WAI-ARIA
  roles + arrow-key nav, not class-string state), EmptyState, Spinner.
- Inline SVG icon components instead of an icon library — tree-shakes
  perfectly, themes via `currentColor` automatically.
- An `Image` component with a reserved aspect ratio, skeleton while loading,
  and a real fallback icon on error/missing src — this single component
  eliminates the "broken image" class of bug across the whole app.
- State stores (Zustand or equivalent): keep them scoped and small — a theme
  store, a persisted user-data store (favorites/library/etc.) — not one
  God-store replacing the old God-context. Export selector hooks that return
  primitives or stable references, not fresh objects, so components only
  re-render on the slice they actually use.

Typecheck, then commit.

## Phase 4 — Feature modules (commit per logical group, or one batch commit)

Organize by feature, not by file type:

```
src/features/<feature>/
  <Feature>Page.tsx
  components/
    <SupportingComponent>.tsx
```

Shared cross-feature UI (cards, carousels, galleries) goes in
`src/components/<domain>/`, not duplicated per feature.

Rules that consistently matter:

- **One card/list-item component**, parameterized, replacing every
  copy-pasted block the audit found. Give it a `layout` prop
  (`carousel` vs `fluid`/grid) rather than relying on className override
  order, which CSS frameworks don't resolve deterministically.
- **Filter/tab/search state lives in the URL** (search params), not component
  state — makes every filtered view shareable and reload-safe. This is a
  direct fix for pages that lost their state on refresh.
- **Validate route params** before using them in a request (numeric id
  regex, not just `Number(param)` — `Number("")` is `0`, `Number("12a")` is
  `NaN`, both are bugs if unchecked). Render a 404 rather than firing a
  request for `/resource/NaN`.
- **Every list has loading, empty, and error states.** If the old app had
  none, this is the single biggest perceived-quality jump.
- **Infinite scroll**: `IntersectionObserver` sentinel + a visible "Load
  more" button fallback for the observer-unsupported/no-JS-intersection
  case.
- **Reduce request waterfalls**: bundle detail-page data server-side
  (`append_to_response`-style params, GraphQL field selection, etc.) instead
  of firing 5-7 sequential requests per page.

## Phase 5 — Routing + cleanup (one commit)

- Lazy-load every route; wrap in Suspense + an ErrorBoundary at the layout
  level so one broken subtree doesn't blank the whole app.
- Real 404 handling — an old catch-all that renders the home page for any
  unmatched path is a bug, not a feature.
- Scroll restoration via the router's built-in mechanism, not a manually
  managed scroll container div.
- **Redirect old URLs** rather than just deleting the routes — old bookmarks
  and external links shouldn't 404 outright if a reasonable redirect target
  exists.
- Delete every legacy file only after its replacement is confirmed working —
  `git rm` the old context/pages/components in this commit, not earlier.

## Phase 6 — Verify (don't skip; don't just claim it)

Run, in this order, and actually read the output:

1. `tsc --noEmit` (or equivalent) — zero errors.
2. Lint — zero errors/warnings if the project enforces `--max-warnings 0`.
3. Production build — watch for bundler-resolution errors (see the stale
   sibling config gotcha in Phase 2), empty/broken chunks.
4. **Boot the dev server and actually drive it in a browser.** A curl 200 on
   `/` only proves the HTML shell loads — it does not prove React mounted or
   that data fetching works. Use Playwright (via `playwright-core` pointed at
   a system Chrome/Edge install if no browser binary can be downloaded —
   check `C:\Program Files\Google\Chrome\Application\chrome.exe` or the
   Linux/mac equivalents) or the project's own run skill if one exists:
   - Navigate home, screenshot, check `console --errors`/page errors.
   - Exercise one state-changing interaction (theme toggle, nav drawer,
     search) and confirm it visibly works.
   - Navigate into a detail/deep route with a real id and confirm real data
     renders, not just the shell.
   - If mobile responsiveness was a stated complaint, repeat at a phone
     viewport width and check the drawer/overlay patterns specifically.
5. If a required credential (API key/token) turns out to be invalid/expired
   during verification, **stop and ask the user for a working one** rather
   than declaring success on an error-state screenshot. An error state
   rendering *correctly* is not the same as the feature working — get a real
   credential and re-verify with actual data before calling it done.
6. Clean up any temporary test scripts, screenshots, or ad-hoc dependencies
   installed purely for verification before finishing.

## Phase 7 — Commit discipline

Commit each completed, self-contained layer as its own commit (foundation →
UI kit/stores → features/routing), not one giant diff at the end. Write commit
bodies that name the specific old bug each change fixes (file:line or
component name), not generic "improve X" language — this is what makes the
history useful to future readers. If the user explicitly asks mid-task to
"commit every feature you completely modify," treat that as standing
instruction for the rest of the session, not just the next commit.

## Reporting back

End with a concise summary: what changed (grouped by the phases above, not a
file-by-file dump), what was explicitly deferred and why, and any action item
that requires the user (credential rotation, a design decision you flagged
but didn't unilaterally resolve). Don't claim "fully verified" unless Phase 6
actually happened with a real credential and a real screenshot/console check
— say plainly if verification was partial and why.
