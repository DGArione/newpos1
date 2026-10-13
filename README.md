# Golden Beach Restaurant — POS

A full point-of-sale system for **Golden Beach Restaurant, Midigama**. The entire
interface has been rebuilt in **Next.js** with a custom "vintage coastal" brand
(olive green + kraft paper, warm terracotta accents) — no generic template look.

```
golden-beach-pos/
├── backend/   Express + built-in SQLite — the API & data layer (/api/*)
└── web/       Next.js 14 (App Router, TypeScript, Tailwind) — the whole UI
```

## Why this split

The backend is the original, battle-tested service that does all the money math,
auth, inventory and reporting **server-side**. Rather than risk subtle bugs by
reimplementing payments/inventory, the UI was rewritten end-to-end in Next.js
and talks to that proven API. The result is a 100% Next.js interface with a
rock-solid core.

## Requirements

- **Node.js ≥ 22.5** (the backend uses the built-in `node:sqlite` module)

## Quick start

```bash
# install both apps
npm run install:all

# run both (backend on :3001, web on :3000)
npm run dev
```

Then open **http://localhost:3000**.

> Or run them in two terminals: `npm run dev:backend` and `npm run dev:web`.
> In dev, `web` proxies `/api/*` to the backend (`BACKEND_URL`, default
> `http://localhost:3001`). On first boot the backend seeds the Golden Beach
> menu and demo accounts into `backend/data/pos.db`.

### Demo logins (PIN)

| Role          | PIN  |
|---------------|------|
| Admin         | 9999 |
| Super Manager | 1234 |
| Manager       | 1111 |
| Server        | 2222 |
| Cashier       | 3333 |
| Kitchen       | 4444 |

Change these under **Users** before real use.

## The menu

The demo menu is replaced with the **real Golden Beach menu** from the printed
price lists — 142 dishes across 22 categories (Rice & Curry, Fried Rice, Kottu,
Pizza, Roti, Juice, Lassi, Milkshake, Breakfast, …) with the correct `Rs.`
prices, including the full pizza range (Margherita Rs.1700 → Mix Seafood
Rs.2800). It lives in `backend/src/db.js` (`seedGoldenBeachMenu`) and is fully
editable in-app under **Menu**.

## Screens (all Next.js)

Order Entry · Payment · Kitchen · Floor · Menu · Dashboard · Reports · History ·
Inventory · Customers · Users · Time Clock · Payroll · Z-Report · Petty Cash ·
Messages · Audit Log · Branches · Online Orders · Settings · and the optional
add-ons (Loyalty · Gift Cards · Promotions · Reservations, toggled in Settings).

## Design system

- **Fonts** — Fraunces (headings), Hanken Grotesk (UI), Yellowtail (brand script)
- **Palette** — olive `#4c5738`, kraft `#ece3d0`, cream panels, terracotta `#b06a38`
- Light **and** dark themes, tokens in `web/src/app/globals.css`

## Deploying

Build the web app with `npm run build` and run the backend as a long-lived
service. Point the web app at the backend with the `BACKEND_URL` env var.
