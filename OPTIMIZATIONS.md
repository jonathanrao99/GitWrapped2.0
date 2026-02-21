# GitWrapped 2.0 – Optimizations & Upgrade Ideas

## Contribution graph (fixed)

- **What was wrong:** The graph was built from a flattened list of days that didn’t align to a Jan 1–Dec 31 grid (API weeks can include prior/next year). Only one or a few squares showed up.
- **What was done:**
  - **fetchYearContributions:** Only includes days in the requested year (`year-01-01` to `year-12-31`).
  - **fetchGraph:** Builds a **date → count** map and a fixed **53×7** grid (weeks × days). For each cell we compute the calendar date, look up the count, and color the cell (GitHub-style: `#21262d` for 0, green shades for 1+). Empty/error states show a short message instead of a broken grid.

---

## Suggested optimizations & upgrades

### 1. **Contribution graph**
- **Tooltips:** On hover, show date and contribution count for each square (e.g. “Jan 15 – 3 contributions”). Requires rendering the graph as React (or using a small script) instead of raw SVG HTML.
- **Legend:** Add a small legend (e.g. “Less” / “More”) with the same green scale so the scale is clear.
- **Loading:** Show a skeleton or “Loading graph…” while the graph is fetched.

### 2. **Performance**
- **Caching:** Cache `fetchUser` / `fetchGraph` (or key parts) in memory or with a short TTL (e.g. 5–10 min) so repeated visits or refreshes don’t hit the API every time.
- **Parallel requests:** You already run `fetchUser` and `fetchGraph` in parallel; keep any extra data (e.g. languages) on the same pattern.
- **Bundle:** Lazy-load the download/share flow (e.g. `html2canvas`) only when the user clicks “Download” so initial load stays light.

### 3. **UX**
- **Empty states:** For “0” stats (e.g. Issues, Contributed To, Current Streak), optional short copy like “No open issues” or “Start a streak!” so the card still feels intentional.
- **Share:** After “Copy link,” show a brief “Copied!” state on the button or a toast (if not already).
- **Errors:** For failed fetches, show a “Retry” button and, if useful, a one-line reason (e.g. “User not found” or “Rate limited”).

### 4. **Design**
- **Consistency:** Reuse a small set of background assets (e.g. 2–3 gradients + 1 pattern) so “Top Languages,” “Issues,” and similar cards feel like one family.
- **Accessibility:** Ensure focus order and contrast (e.g. white text on red pattern) meet WCAG; add `aria-label` on icon-only buttons (Share, Copy, Download).
- **Dark/light:** Optional theme toggle that switches card backgrounds and text for light mode.

### 5. **Data & features**
- **Top Languages:** Already real data; optional small bar or donut next to the list for a quick visual.
- **Member since:** You have `createdAt` from the API; a “Member since …” line or card would be easy to add.
- **Best month:** From contribution data, compute “Best month: August (142 contributions)” and surface it in a card or subtitle.

### 6. **Technical**
- **React graph:** Replacing the contribution graph’s `dangerouslySetInnerHTML` with a React component (e.g. a grid of `rect` elements or a small canvas) would make tooltips and future tweaks easier.
- **Stricter TypeScript:** Keep `ignoreBuildErrors` and `ignoreDuringBuilds` off and fix any new errors so the codebase stays type-safe.
- **Tests:** Add a few tests for `calculateMostActiveDay`, `calculateLongestStreak`, and the graph’s date→cell logic so refactors don’t break the graph again.

---

## Quick wins (no new dependencies)

1. Add a “Retry” button and short message on fetch error.
2. Show “Copied!” (or similar) after copying the share link.
3. Add a one-line “Member since” under the username using `createdAt`.
4. Add `aria-label` to Share / Copy / Download for accessibility.
5. Cache `fetchUser` / `fetchGraph` in memory with a 5–10 minute TTL per username.

Implementing these in small steps will improve both the contribution graph and the overall product.
