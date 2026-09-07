# 1Fi Marketplace — Mobile App

A standalone Expo (React Native + TypeScript) app implementing the Shop
page's three-tab layout, with the 1Fi Marketplace section fully built out:
product listing → product detail (variants + EMI plans) → order review with
a server-computed EMI quote.

## Setup

```bash
cd mobile
npm install
```

### 1. Point the app at the backend

Make sure the backend (see `../backend/README.md`) is running first.

- **Running in a web browser or an Android/iOS simulator on the same
  machine:** the default `http://localhost:8000/api` in
  `src/services/api.ts` works as-is.
- **Running on a physical device via Expo Go:** the phone can't resolve
  your computer's `localhost`. Find your machine's LAN IP
  (`ipconfig getifaddr en0` on Mac, `ipconfig` on Windows, `hostname -I` on
  Linux) and update `API_BASE_URL` in `src/services/api.ts` to
  `http://<your-lan-ip>:8000/api`. Phone and computer need to be on the
  same Wi-Fi network.

### 2. Run it

```bash
npm start
```

This opens Expo's dev tools. Press `i` for iOS simulator, `a` for Android
emulator, `w` for web, or scan the QR code with the Expo Go app on your
phone.

## Project structure

```
mobile/
  App.tsx                        entry point, sets up navigation
  src/
    navigation/
      RootNavigator.tsx           root stack: tab bar + screens that push over it
      MainTabs.tsx                floating 5-tab bar (Home/Shop/EMI Dues/Limit/Profile)
    screens/
      ShopScreen.tsx               hero banner + segmented tabs + per-tab content
      HomeScreen.tsx / EMIDuesScreen.tsx / LimitScreen.tsx / ProfileScreen.tsx   placeholders
      MarketplaceListScreen.tsx    search, category filters, product grid
      ProductDetailScreen.tsx      images, variant picker, EMI plan picker
      OrderReviewScreen.tsx        server-computed EMI quote + confirm CTA
    components/                   reusable, presentation-only UI pieces
      SegmentedTabs.tsx            pill tab selector (Top Brands/Nearby Stores/Marketplace)
      ShopHeroBanner.tsx           Shop page promotional header
      PlaceholderScreen.tsx        shared "not implemented" screen
    services/api.ts               single point of contact with the backend
    theme/index.ts                design tokens (colors, spacing, type scale)
    types/index.ts                shared TypeScript interfaces + nav param lists
```

## Design decisions worth knowing about

- **This is a standalone app, not a patch to 1Fi's real APK.** 1Fi's
  production app is closed-source and compiled; decompiling and patching
  it isn't a reasonable (or appropriate) way to complete this assignment.
  Instead, this recreates the Shop page and builds the Marketplace section
  as a new, fully working app with its own consistent design system —
  which is what a real PR against their codebase would also need to ship
  with. `src/theme/index.ts` is the single file that would need to change
  if given access to 1Fi's actual design tokens.
- **No hardcoded product data.** Every screen fetches from the FastAPI
  backend; `src/services/api.ts` is the only file that knows the API's
  shape.
- **Loading / error / empty states are handled everywhere data is
  fetched** — not just the "happy path." See `LoadingState`, `ErrorState`,
  and `EmptyState` used across all three data-driven screens.
- **The EMI math shown while browsing is an estimate; the number on the
  final review screen is fetched from the backend.** A real app should
  never let the client be the source of truth for a number that affects
  what a user is charged.
- **State management:** kept to local component state + React Navigation
  params, since the flow doesn't need global state (no cart, no auth). If
  this grew (e.g. a persistent cart across tabs), the natural next step
  would be a `CartContext` or a small Zustand store rather than reaching
  for Redux.

## What's out of scope (by design)

- Top Brands and Nearby Stores are intentionally blank, per the
  assignment.
- Order placement is simulated (a delayed confirmation alert) since there's
  no real payments/fulfillment backend to integrate with — the point was to
  demonstrate the flow and the loading/disabled states on the CTA, not to
  build a payment gateway.
