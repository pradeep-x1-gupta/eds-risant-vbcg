# Risant Health Header & Footer Design Plan

## Objective

Design the site header and footer to match the two Risant Health reference images:

- **Header** — a full-width dark-navy bar (~64px tall) with the Risant Health logo (three-figure mark + orange sunburst, white wordmark, small ®) left-aligned inside the site container. No nav links, no actions/toggles.
- **Footer** — a dark-navy block with: the Risant Health logo, a "Send feedback to [Clinical Library]" line (link in light blue), a bold "**Disclaimer:**" paragraph in white, and a "© 2026 Risant Health, Inc" copyright line. Left-aligned within the container; rounded top corners as shown.

This is styling **and** content: I'll update the block CSS/tokens and author the header & footer fragment content.

## Decisions (confirmed)

- **Logo:** ✅ **Received.** Official Risant Health logo SVG provided (248×32 viewBox — combined mark + "Risant Health" wordmark + ®, white figures/wordmark with orange `#F6B350` sunburst). I'll save it as an asset and wire it into the brand link.
- **Scope:** Styling **+ content** — author fragment content and style both blocks.
- **Theme:** **Rebrand global tokens** — introduce Risant navy as the brand/background and orange as accent across the site, not just header/footer.

## Logo handling note (important)

The supplied logo is a **fixed two-color** asset (white + `#F6B350` orange) — it is *not* a single-color `currentColor` icon like the repo's existing `img/icons/*.svg`. So it should ship as a standalone brand SVG that keeps its own colors, sized to ~32px tall, and placed on the navy bar. I'll preserve its baked-in colors rather than force `currentColor` (which would flatten the orange). The included wordmark + ® means no separate text is needed in the brand link.

## How this repo builds header & footer (verified)

- Header and footer are **fragment-driven blocks**: `blocks/header/header.js` loads `/fragments/nav/header`; `blocks/footer/footer.js` loads `/fragments/nav/footer`. Content lives in those fragments, styling in `header.css` / `footer.css`.
- `header.js` decorates section 1 as **brand**, section 2 as **nav**, section 3 as **actions**; and looks for widget links (`/tools/widgets/scheme|language|toggle`). The Risant header has only a logo, so the header fragment needs just the brand section — nav/actions/widgets simply won't be present, which the code tolerates. `decorateBrandSection` expects a text node after the logo; since our logo SVG already contains the wordmark, I'll confirm this path handles a text-less brand link cleanly (adjust if needed).
- `footer.js` pops the last section as `.section-copyright` and the second-to-last as `.section-legal`. Our footer content maps cleanly: logo + feedback + disclaimer sections, then a final copyright section.
- Design tokens (colors, spacing, `--header-height: 64px`, fonts) live in `styles/styles.css`. Brand is currently `--color-purple-500`; there's a light/dark toggle via `light-dark()`.
- The reference is a **fixed dark-navy** look. Rebranding tokens means setting navy as the brand/background base and orange as accent, and ensuring header/footer render navy in the default scheme.

## Open items

- **Exact brand colors** — orange is confirmed from the SVG as `#F6B350`. I'll sample the navy (~deep navy `#0f1e3d`) from the screenshots and add it as a token; will confirm final hex.
- **Feedback link target** — the "Clinical Library" href. I'll use a placeholder (`#`) unless you provide the real URL.

## Checklist

### Phase 1 — Assets & tokens
- [ ] Save the provided Risant Health logo SVG as a standalone brand asset (e.g. `img/icons/logo.svg`), preserving its white + `#F6B350` colors; normalize markup (viewBox, remove mask/ids as safe) without flattening color.
- [ ] Add Risant brand tokens to `styles/styles.css`: navy (background/brand), orange accent `#F6B350`, on-navy text (white) and link (light blue) colors.
- [ ] Rebrand global tokens: point `--color-brand`, background/surface, and accent at the Risant palette; verify light/dark `light-dark()` behavior still resolves sensibly.

### Phase 2 — Header
- [ ] Author the header fragment content (`/fragments/nav/header`): a single brand section with the logo linking to the index.
- [ ] Update `header.css`: full-width navy bar, logo left-aligned within `--grid-container-width`, ~32px logo height, correct 64px bar height; ensure no nav/action affordances render.
- [ ] Verify `decorateBrandSection` handles the wordmark-in-SVG (no trailing text node) without error.

### Phase 3 — Footer
- [ ] Author the footer fragment content (`/fragments/nav/footer`): logo section, "Send feedback to [Clinical Library]" line, bold "Disclaimer:" paragraph, and final "© 2026 Risant Health, Inc" copyright section.
- [ ] Update `footer.css`: navy background, rounded top corners, white text, light-blue links, left-aligned content within the container, spacing to match the reference.
- [ ] Confirm `footer.js` section mapping (copyright/legal) still holds with this content.

### Phase 4 — Verify
- [ ] Preview a page and inspect the rendered header & footer (DOM snapshot + computed styles) against the reference images.
- [ ] Check responsive behavior (mobile: header stays a single navy bar with logo; footer stacks correctly).
- [ ] Confirm color contrast (white / light-blue on navy) meets accessibility expectations.
- [ ] Take a final screenshot only for pixel-level confirmation once structure checks pass.

## Notes on execution
- **Execution requires Execute mode** — Phases 1–4 involve editing CSS/tokens and authoring fragment content (write operations).
- I'll keep changes in project-owned files (`styles/styles.css`, `blocks/header/*`, `blocks/footer/*`, fragment content) and avoid `scripts/ak.js`.
- Logo is in hand, so no blockers remain except the optional Clinical Library URL and final navy hex confirmation.
- **Next action:** approve the plan to proceed in Execute mode (optionally provide the Clinical Library URL).
