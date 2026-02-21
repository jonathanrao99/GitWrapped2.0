# GitWrapped 2.0 – Repository Review: Updates & Optimizations

This document summarizes suggested updates, fixes, and optimizations after a full repo review.

---

## 1. Security

### 1.1 GitHub token exposure (high priority)

**Issue:** The app uses `NEXT_PUBLIC_GITHUB_TOKEN`. In Next.js, any `NEXT_PUBLIC_*` env var is inlined into the client bundle and visible to anyone.

**Fix:** Use a server-only variable so the token never reaches the client.

- In **`actions/graphql.ts`**: use `process.env.GITHUB_TOKEN` (no `NEXT_PUBLIC_`).
- In **`.env.local`** and **`setup.md`**: document `GITHUB_TOKEN=ghp_...` (and remove `NEXT_PUBLIC_GITHUB_TOKEN` from setup instructions).
- Ensure all GitHub API calls stay in server code (they already do via server actions).

### 1.2 API route path safety

**Issue:** In **`app/api/change-background/route.ts`**, `backgroundPath` from the request is used in `path.join(process.cwd(), 'public', backgroundPath)` without validation. A value like `../../../etc/passwd` could escape `public/`.

**Fix:** Validate against an allowlist of known asset paths before joining:

```ts
const ALLOWED_BACKGROUNDS = ['assets/frame2.png', 'assets/bg3.png', 'assets/bg4.png', 'assets/grad1.jpg', 'assets/black.png'];
if (!ALLOWED_BACKGROUNDS.includes(backgroundPath)) {
  return NextResponse.json({ error: 'Invalid background' }, { status: 400 });
}
```

---

## 2. Typos and naming

### 2.1 "Total Contibutions" → "Total Contributions"

- **`types/index.ts`**: `'Total Contibutions'` → `'Total Contributions'`.
- **`actions/fetchUser.ts`**: same key when building `userStats`.
- **`components/Github/Github.tsx`**: `userStats["Total Contibutions"]`.
- **`utils/achievements.ts`**: all `'Total Contibutions'` references.
- **`components/Github/Github Components/TimeAnalysis.tsx`**: same.
- **`components/ui/share-buttons.tsx`**: same in `shareText`.

Do a project-wide replace for the key and any display strings that mention "Contibutions".

### 2.2 "contros" → "contributed" (or "contributions")

- **`components/Github/Github Components/ContributedTo.tsx`**: prop `contros` → e.g. `contributed` or `contributedCount`.
- **`components/Github/Github.tsx`**: pass the new prop name.

### 2.3 Variable name in fetchUser

- **`actions/fetchUser.ts`**: `contibutonYears` → `contributionYears`.

---

## 3. TypeScript and types

### 3.1 Replace `any` with concrete types

- **`Recoil/State/atom.ts`**: `graphState` is `atom<any>`. Introduce a type, e.g. `{ graph: string }`, and use it.
- **`actions/graphql.ts`**: `variables: Record<string, any>` can be a generic or a union of known variable shapes.
- **`utils/errorHandler.ts`**: `handleGitHubError(error: any)` → use `unknown` and narrow (e.g. `error instanceof Error`).
- **`utils/achievements.ts`**: `calculateAchievements(userStats: any)` → use `UserStats` from `@/types`.
- **`components/ui/share-buttons.tsx`**: `userStats: any` → `UserStats`.
- **`actions/fetchYearContributions.ts`**: replace `week: any` and `day: any` with a small interface for the contribution calendar node.

### 3.2 Turn on strict checks in build

- **`next.config.mjs`**: `typescript: { ignoreBuildErrors: true }` and `eslint: { ignoreDuringBuilds: true }` hide real issues. Remove these (or set to `false`) and fix TypeScript/ESLint errors so CI and production builds stay strict.

---

## 4. Code quality and consistency

### 4.1 `useEffect` dependency in `app/page.tsx`

`loadUserData` is used inside `useEffect` but not in the dependency array, which can cause stale closures and lint warnings.

**Fix:** Wrap `loadUserData` in `useCallback` and include it (and any other deps) in the effect deps, or keep the effect dependent only on `searchParams` and `hasUserData` and document why (e.g. with an eslint-disable comment) if that’s intentional.

### 4.2 Error logging in fetchGraph

- **`actions/fetchGraph.ts`**: `console.log(error)` in the catch block → use `console.error(error)` (and optionally a small log context).

### 4.3 Redundant toasts in download handler

- **`components/Github/Github.tsx`**: `handleDownloadImage` calls `toast({ title: "Downloading...", generating: true })` multiple times. Keep a single “Downloading…” toast and one “Success” or “Error” toast.

### 4.4 Duplicate dotenv in graphql

- **`actions/graphql.ts`**: `dotenv.config()` is unnecessary in Next.js; env files are loaded automatically. You can remove the `dotenv` import and call (and optionally drop the `dotenv` dependency if it’s only used here).

---

## 5. Dependencies and bundle

### 5.1 Unused or redundant packages

- **`html-to-image`** and **`use-react-screenshot`**: Only **`html2canvas`** is used in `Github.tsx` for the download. Remove `html-to-image` and `use-react-screenshot` (and any related types like `@types/dom-to-image`) to reduce bundle size and maintenance.

### 5.2 Optional: replace uuid in API route

- **`app/api/change-background/route.ts`**: Uses `uuid` only for the download filename. You could use `crypto.randomUUID()` (Node 19+ / modern runtimes) and remove the `uuid` dependency.

---

## 6. UX and content

### 6.1 Loading state default

- **`Recoil/State/atom.ts`**: `loadingState` default is `true`. Since no automatic load runs on mount when there’s no `?user=`, consider defaulting to `false` so “loading” is only shown when a request is actually in progress. Verify that no UI assumes “loading === true” on first paint.

### 6.2 Background select options

- **`components/Github/Github.tsx`**: Select values are `apple`, `banana`, `blueberry`, `grapes`, `custom`. Consider clearer value/labels (e.g. `frame2`, `bg3`, `grad1`, `custom`) and map to the same asset paths. This improves accessibility and maintainability.

### 6.3 Constants and copy

- **`constants/index.ts`**: Contains `name: "Shawn."` and similar. Update to your branding (e.g. your name/username and description) or remove if unused.

---

## 7. Data and features

### 7.1 Languages and Peak Hours

- **`components/Github/Github Components/Languages.tsx`**: Uses `getMockLanguages()` (hardcoded percentages). For a more accurate “Top Languages” block, consider fetching language stats (e.g. from GitHub’s REST API or a custom aggregation) and wiring them into this component.
- **`components/Github/Github Components/TimeAnalysis.tsx`**: “Peak Hours” is static mock data. To make it real, you’d need contribution timestamps (e.g. from the API or a backend that stores them) and compute time-of-day distribution.

Adding a short comment or a small “Demo data” label in the UI for these two blocks would set user expectations until real data is wired.

---

## 8. Structure and maintainability

### 8.1 Folder and file names

- **`components/Github/Github Components/`**: Space in the folder name can be awkward in some tools. Consider renaming to e.g. `GithubComponents` or `components/bento/` and updating imports.

### 8.2 Centralize background config

- Background keys and asset paths are repeated (e.g. in `Github.tsx` and the API route). Consider a single source of truth, e.g. **`constants/backgrounds.ts`**:

```ts
export const BACKGROUND_OPTIONS = [
  { id: 'frame2', path: 'assets/frame2.png', label: 'Frame 2' },
  { id: 'bg3', path: 'assets/bg3.png', label: 'Background 3' },
  // ...
] as const;
```

Use this in the Select, in `getBackgroundImageUrl`, and in the API allowlist.

---

## 9. Performance (optional)

- **Next.js**: Ensure heavy dependencies (e.g. `html2canvas`, `sharp`) are only loaded where needed. The download flow already uses `html2canvas` only on button click, which is good.
- **Recoil**: Current usage is fine. If the tree grows, consider selectors for derived state (e.g. “hasUserData”) to avoid unnecessary re-renders.
- **Images**: You already use `next/image` and `priority` where appropriate. Keep using it for all static and dynamic images.

---

## 10. Quick-win checklist

| Priority | Item |
|----------|------|
| High    | Switch to `GITHUB_TOKEN` (no `NEXT_PUBLIC_`) and update setup docs. |
| High    | Validate `backgroundPath` in `change-background` API with an allowlist. |
| Medium  | Fix “Total Contibutions” typo everywhere; fix “contros” prop name. |
| Medium  | Type `graphState`, remove `any` in errorHandler, achievements, share-buttons. |
| Medium  | Remove `html-to-image` and `use-react-screenshot`; fix duplicate toasts. |
| Low     | Remove `dotenv` from graphql; use `console.error` in fetchGraph. |
| Low     | Consider `loadingState` default `false`; tidy constants and background option labels. |

Applying the high- and medium-priority items will improve security, type safety, and clarity with minimal risk. If you want, the next step can be concrete patches (diffs) for the security and typo fixes.
