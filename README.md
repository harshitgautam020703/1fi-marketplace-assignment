# 1Fi Marketplace — SDE Intern Assignment

This repo implements the Shop page's 1Fi Marketplace section: product
listing → product detail (with variants and EMI plans) → order review, on
top of a small mock backend that serves the product/EMI data.

- **`backend/`** — FastAPI mock API (product listing, filters, search, and
  server-computed EMI quotes). See `backend/README.md`.
- **`mobile/`** — Expo (React Native + TypeScript) app implementing the
  Shop page and the full Marketplace flow. See `mobile/README.md`.

## Quick start

```bash
# Terminal 1 — backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 — mobile app
cd mobile
npm install
npm start
```

Then press `w` (web), `i` (iOS simulator), or `a` (Android emulator) in the
Expo CLI, or scan the QR code with Expo Go on a physical device (see
`mobile/README.md` for the LAN-IP note if using a physical device).

## Approach

I don't have access to 1Fi's actual (closed-source, compiled) app or
codebase, so rather than attempting to reverse-engineer and patch the
production APK — which would be fragile, likely blocked by the app's own
security measures, and not really what this kind of assignment is meant to
test — I built the Shop page and Marketplace section as a standalone app
with its own internally consistent design system. The focus went into the
things the assignment explicitly asks to be evaluated on:

1. **Product understanding** — the Marketplace flow covers everything
   listed in the spec: product listing, image/name/price/variants, EMI
   plans, EMI selection, and a CTA to proceed — plus a review step before
   confirming, which is standard for any EMI/checkout flow.
2. **UI/UX consistency** — a single `theme/` file drives every color,
   spacing, and type value across the app, so the Marketplace section
   reads as one coherent product rather than a bolted-on feature.
3. **Engineering quality** — the backend separates routing, data access,
   and models into their own layers; the mobile app separates
   presentational components, screens, navigation, types, and the API
   client. Both are covered by tests (backend: pytest; mobile: full
   TypeScript strict-mode typecheck passes clean).
4. **Functionality** — the full flow (browse → filter/search → pick a
   product → pick a variant → pick an EMI plan → review the real computed
   quote → confirm) works end to end against the mock backend.
5. **Data/API implementation** — nothing is hardcoded into components;
   everything comes from `GET /api/products`, and the EMI numbers shown at
   final review are computed server-side rather than trusted from the
   client.
6. **Attention to detail** — every data-fetching screen has explicit
   loading, error (with retry), and empty states; out-of-stock variants
   are disabled with a visible reason; pull-to-refresh on the listing;
   debounced search.

## Design source: matching 1Fi's real UI

I was sent real screenshots of the 1Fi app (Shop page, Home, Profile,
Gift Voucher/EMI screens) partway through, and used them to replace my
initial "generic fintech" design guesses with values read directly off
the real product. What changed, and why:

**Extracted design tokens** (`src/theme/index.ts`)
- Primary violet (`#6D28D9`) and lavender soft-fill (`#EFE9FE`), matched
  from the bottom nav's active state, the "Continue" CTA, and the
  segmented tab selector.
- Warm light-gray background (`#F5F5F8`) instead of a cooler gray.
- Noticeably larger corner radii (22px on outer cards, pill-shaped
  buttons/chips) — 1Fi's UI reads rounder than a typical Material app.
- Bolder, larger heading weights (800/700) matching "Profile" and "Gift
  voucher" headings.
- One thing I did **not** guess: the actual typeface. The screenshots show
  a rounded geometric sans, but shipping a specific font file based on a
  screenshot read would be a confident-looking wrong guess rather than a
  real match, so this uses the platform default and flags it as an
  assumption in the theme file's comments.

**Structural changes to match real navigation patterns**
- Replaced the swipeable top-tab bar with a **segmented pill control**
  (`SegmentedTabs.tsx`) matching the exact Top Brands / Nearby Stores
  selector shown in the Shop page screenshot — now with 1Fi Marketplace
  added as a third segment.
- Added the **floating 5-tab bottom nav** (Home / Shop / EMI Dues / Limit
  / Profile) since that's core to the app's identity, even though only
  the Shop tab has any real content.
- Rebuilt the navigation as a **root stack wrapping the tab bar**, so that
  Product Detail and Order Review push on top and hide the tab bar — this
  mirrors what the screenshots actually show: the "Pay using 1Fi" / gift
  voucher screen has no bottom nav and a back-arrow header, not a
  tab-embedded view. (See `src/navigation/RootNavigator.tsx` and
  `MainTabs.tsx`.)
- Reworked the EMI plan picker from a card-with-radio-button pattern into
  a **flat row list** (tenure/rate left, monthly figure right, divider
  between rows), matching the actual EMI plan list screen instead of a
  pattern I'd invented.
- Added a static hero banner reproducing the Shop page's "Shop today, Pay
  later using Mutual funds" copy and badge. I deliberately did **not**
  reproduce its illustrated gradient artwork — that would need
  `expo-linear-gradient` plus sourcing/recreating an illustration, which
  wasn't worth the added dependency and asset time for a banner that
  isn't part of what's being evaluated. This is flagged as a deviation in
  `ShopHeroBanner.tsx`'s comments, with the reasoning inline.

**What I deliberately left alone**

Per the assignment brief ("you are not expected to redesign the existing
1Fi app"), I did not audit or attempt to improve Top Brands, Nearby
Stores, Home, Profile, EMI Dues, or Limit — they're placeholders, exactly
as scoped. The goal here was fitting the *new* Marketplace section into
1Fi's existing visual language, not evaluating or revising it.

**Accessibility touches already in place:** every interactive element
(segmented tabs, variant chips, EMI rows, buttons, product cards) has an
explicit `accessibilityRole`/`accessibilityState`, and `minTouchTarget`
(44dp) is enforced on tappable rows/segments rather than left to
whatever a row's content happens to require.

## What I'd do next with more time

- Persist a cart/wishlist across the Marketplace and wire up a badge on
  the Shop tab.
- Add component-level tests (React Native Testing Library) alongside the
  backend's pytest suite.
- Skeleton loaders instead of a spinner for the product grid.
- Pagination/infinite scroll once the catalog is larger than a few dozen
  items.
