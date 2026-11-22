# ShopLedger

## Stack

Node.js with CommonJS, Express (`^4.17.1`), and `body-parser` (`^1.19.0`). The browser UI in `public/` uses plain HTML, CSS, and JavaScript. `server.js` serves the UI and printable GST invoices and mounts the API under `/api`. App data lives in `data/db.json`.

## Module map

- `routes/customers.js` — lists Khata customers and recent settlements and records payments.
- `routes/orders.js` — lists, fetches, places, and cancels orders.
- `routes/products.js` — serves the searchable product catalog, stock figures, and active coupons.
- `routes/reports.js` — serves the dashboard, GST reconciliation, cart price preview, and admin export.
- `lib/coupons.js` — normalizes and validates coupon codes and calculates discounts.
- `lib/dates.js` — formats local dates, normalizes date strings, and derives fiscal years.
- `lib/inventory.js` — looks up products, computes sellable stock, checks quantities, deducts stock, releases holds, and summarizes inventory.
- `lib/invoice.js` — computes invoice figures and renders printable HTML.
- `lib/ledger.js` — manages Khata balances, order debits and reversals, and settlements.
- `lib/orders.js` — adds, fetches, lists, and cancels orders in memory.
- `lib/pricing.js` — computes checkout subtotals, discounts, GST, and totals.
- `lib/reports.js` — builds dashboard summaries and compares invoice figures with saved order totals.
- `lib/store.js` — reads and writes the JSON data file and appends audit entries.
- `lib/tax.js` — resolves GST rates and splits tax into CGST and SGST.

## Commands

- Start the app from the repo root with `node server.js`. The port defaults to `3000` and can be set with `PORT`.
- Run tests from the repo root with `node --test`. The checkout has no test files yet. The `npm test` script is a failing placeholder.

## Rules

1. Write characterization tests before changing behaviour.
2. Change only the module or modules the ticket is about.
3. Tests never read or write `data/db.json`. Use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket

Cannot sell the last sellable unit in stock. `inventory.check()` rejects `qty >= sellable`, including an exact match.

Cancelling an order never restores physical stock. `inventory.reserve()` deducts from `stock` using the line's `id`. `orders.cancel()` calls `inventory.release()`, which looks for `productId` and only adjusts `reserved` if it finds a match.

Allowed files are `lib/inventory.js` and `lib/orders.js` (`cancel()` only).
