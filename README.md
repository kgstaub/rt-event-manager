# RT Event Manager

Round Table International event management for **WordPress + WooCommerce**.

RT Event Manager turns a WooCommerce store into a complete event platform: it sells
attendee tickets, gives every member a purpose-built account portal (dashboard,
profile, tours, event calendar, order history, visa letters and a merch shop),
handles pretours & day tours, ticket transfers and refund requests, issues
**Apple Wallet** and **Google Wallet** passes with live push updates, prints
attendee badges, generates PDF receipts/invoices and letters of invitation, and
ships a **staff QR check-in web app**. It also bundles a *Sign in with .WORLD*
SSO module for Round Table's identity providers.

- **Version:** 2.1.8
- **Requires:** WordPress 5.0+, PHP 7.4+, WooCommerce 5.0+ (tested to 8.0)
- **License:** GPL-2.0-or-later
- **Author:** Kenneth Staub, RT Switzerland

> Built for the RTI Half-Year Meeting (RTI HYM 2027) but written generically for
> any Round Table event.

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Ticket products](#ticket-products)
- [The member account portal](#the-member-account-portal)
- [Tours: pretours & day tours](#tours-pretours--day-tours)
- [Transfers & refunds](#transfers--refunds)
- [Wallet passes (Apple & Google)](#wallet-passes-apple--google)
- [Staff check-in](#staff-check-in)
- [Visa letters of invitation](#visa-letters-of-invitation)
- [Badges](#badges)
- [Receipts & invoices](#receipts--invoices)
- [Sign in with .WORLD (SSO)](#sign-in-with-world-sso)
- [Admin pages](#admin-pages)
- [Shortcodes](#shortcodes)
- [Database tables](#database-tables)
- [REST API](#rest-api)
- [Privacy & security](#privacy--security)
- [Versioning](#versioning)
- [Development](#development)
- [Changelog](#changelog)

---

## Features

- **Attendee ticketing** on top of WooCommerce products — event tickets, Future
  member (minor) tickets, pretours and day tours, each with per-holder details
  (name, phone, dietary needs, family/club, `.WORLD` ID, date of birth for minors).
- **Member account portal** — a shortcode-driven replacement for the WooCommerce
  *My Account* page: dashboard, profile, event tickets, tours, event calendar,
  order history with PDF receipts, travel & visa, and a merch shop.
- **Holographic dashboard ticket** — a physical-style ticket with a perforated
  QR stub, mascot and Add-to-Wallet buttons, finished with a subtle red foil
  hologram (micro-printed event name + motto) that catches the light on hover
  and scroll. A "Disable motion effects" toggle and `prefers-reduced-motion`
  are both honoured.
- **Pretours & day tours** — add-on tickets linked to a main attendee; one
  pretour per person, day tours may stack unless their time slots overlap.
- **Ticket transfers** — offer a ticket to someone else by email; they accept
  or decline, organisers can withdraw a pending offer.
- **Refunds & cancellations** — customer-initiated cancellation with an admin
  confirm/decline workflow (the actual payment refund is processed in the order).
- **Apple Wallet & Google Wallet passes** — add-to-wallet links, with a server
  push/PATCH pipeline so a pass updates on the device when a ticket's status or
  tours change.
- **Staff QR check-in web app** — a mobile-friendly shortcode page that scans a
  ticket's QR (a signed check-in token) and marks attendance.
- **Visa letters of invitation** — generate a German letter of invitation PDF
  per applicant from a configurable template and host details.
- **Attendee badges** — configurable badge template + generator (name, club,
  QR), suitable for on-site printing.
- **PDF receipts / invoices** — per-order and combined PDFs with a configurable
  full-page letterhead background.
- **Privacy-policy consent** — explicit consent on registration and checkout,
  recorded per member and per order, with an admin "require re-consent" trigger.
- **Sign in with .WORLD** — bundled OAuth SSO for Round Table's world identity
  providers (TABLER, 41ER, CIRCLER, AGORACLUB, TANGENTCLUB).

---

## Requirements

| Component     | Minimum                          |
|---------------|----------------------------------|
| WordPress     | 5.0+                             |
| PHP           | 7.4+                             |
| WooCommerce   | 5.0+ (tested to 8.0)             |
| PHP extensions| `gd`/`imagick`, `openssl`, `zip` |

Composer dependencies (already vendored in `vendor/`):

- [`endroid/qr-code`](https://github.com/endroid/qr-code) — QR codes for tickets and badges
- [`dompdf/dompdf`](https://github.com/dompdf/dompdf) — PDF generation (receipts, visa letters, badges)
- [`phpoffice/phpspreadsheet`](https://github.com/PHPOffice/PhpSpreadsheet) — spreadsheet exports

---

## Installation

1. Ensure **WooCommerce** is installed and active.
2. Copy the plugin folder to `wp-content/plugins/rt-event-manager/`.
3. If the `vendor/` directory is not present, install dependencies:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
4. Activate **RT Event Manager** in *Plugins*. On activation it creates its
   custom database tables and default options.

---

## Quick start

1. **Create the account page.** Add a page containing the shortcode
   `[rt_event_manager_account]` and set it as *WooCommerce → Settings →
   Advanced → My account page*. Logged-out visitors get login/registration
   (including *Sign in with .WORLD*); logged-in members get the portal.
2. **Mark your ticket products.** Edit a WooCommerce product and flag it as a
   ticket (see [Ticket products](#ticket-products)); set its kind (event,
   Future member, pretour, day tour).
3. **Configure the event.** Under *RT Event → Settings* set the event dates,
   the ticket edit cutoff, the short event name, logos, the merch category, the
   privacy-policy URL and the invoice/receipt background.
4. **(Optional) Wallets & check-in.** Configure *Apple Wallet* / *Google Wallet*
   with your certificates, and publish a page with `[rt_event_manager_checkin]`
   for door staff.

---

## Ticket products

Tickets are ordinary WooCommerce products flagged with the ticket meta
(`_rti_is_ticket = yes`) and a **kind**:

| Kind      | Meaning                                                        |
|-----------|---------------------------------------------------------------|
| `event`   | A full event ticket for an adult attendee.                    |
| `minor`   | A Future Tabler / Circler ticket (child; requires a guardian and date of birth). |
| `pretour` | A pretour add-on, linked to a main attendee (one per person). |
| `daytour` | A day-tour add-on; may stack unless time slots overlap.       |

When a ticket product is purchased, the buyer enters holder details at checkout
(the buyer's own ticket prefills name and billing phone). Each purchased ticket
becomes a row in the tickets table and appears in the holder's account portal.
Editing holder details is allowed until a configurable **cutoff**.

---

## The member account portal

Rendered by `[rt_event_manager_account]`, the portal replaces the default
*My Account* screen while transparently passing through WooCommerce endpoints
(order-pay, lost-password, view-order, etc.). Tabs:

- **Dashboard** — a physical-style ticket (QR stub, mascot, wallet buttons,
  holographic foil) plus at-a-glance status and quick links.
- **My Profile** — read-only `.WORLD` identity/club fields plus editable local
  fields (emergency contacts, function/role) with save-on-exit.
- **Event Tickets** — the member's own ticket and companions ("travelling with
  me"), inline-editable within the cutoff, plus "add more tickets".
- **Tours** — pretours and day tours, with add flows and per-slot conflict checks.
- **Event Calendar** — the official agenda plus the member's own tours.
- **Order History** — orders with downloadable per-order and combined PDF receipts.
- **Travel & Visa** — request a letter of invitation.
- **Shop** — merch/regalia (non-ticket products) in the configured category.

Incomplete profile/ticket/emergency information surfaces as notification badges
on the navigation.

---

## Tours: pretours & day tours

- A **pretour** is one-per-person and attaches to an event or Future-member ticket.
- **Day tours** may stack, but the plugin blocks adding one whose time slot
  overlaps a day tour the attendee already holds (booked or in the cart), with a
  clear "already booked for this time slot" message.
- Companions/minors may only join the same tour as their guardian.

---

## Transfers & refunds

- **Transfers** — a holder can offer a confirmed, unlocked ticket to another
  person by email. The invitee accepts (needs a valid account/ticket) or
  declines; organisers can withdraw a pending offer from *RT Event → Transfers*.
- **Refunds** — customers can request cancellation of a confirmed ticket; the
  request appears under *RT Event → Refunds & Cancellations* for an admin to
  confirm or decline (with a note). The actual payment refund is processed in
  the WooCommerce order.

---

## Wallet passes (Apple & Google)

- **Apple Wallet** — configure the Pass Type ID certificate (stored encrypted),
  team ID, branding and venue under *RT Event → Apple Wallet*. Passes are signed
  server-side; a PassKit web service handles device registration and pushes an
  update when a ticket changes.
- **Google Wallet** — configure the Issuer ID and a service-account JSON key
  (stored encrypted) under *RT Event → Google Wallet*. Save links are generated
  and objects are PATCHed server-side to reflect changes.

Branding (organisation, event name, venue, colours, dates) is shared between the
two wallet pages.

---

## Staff check-in

Publish a page with `[rt_event_manager_checkin]` and give the URL to door staff.
The page scans a ticket's QR code — a signed check-in token — verifies it and
marks the ticket checked in. Check-in tokens are valid credentials; do not share
real attendees' QR codes.

---

## Visa letters of invitation

Under *RT Event → Visa Settings* configure the host details, two signatories,
an optional full-page A4 letterhead background and a German letter template with
placeholders (`{applicant_name}`, `{event_start}`, `{arrival}`, …). Letters are
generated per applicant as PDFs and listed under *RT Event → Visa Letters*.
Applicant PII is stored encrypted, and a ticket's visa letters are permanently
deleted when the ticket is cancelled or refunded.

---

## Badges

*RT Event → Badge Template* configures the on-site badge layout; the badge
generator renders per-attendee badges (name, club, QR) for printing.

---

## Receipts & invoices

Members download PDF receipts from *Order History* (per order or a combined PDF
of all their orders). The full-page A4 background (letterhead) drawn behind the
receipt/invoice PDFs is set under *RT Event → Settings*
(`rt_event_manager_receipt_bg_img`).

---

## Sign in with .WORLD (SSO)

A bundled OAuth client lets members sign in / auto-provision with Round Table's
identity providers (TABLER.WORLD, 41ER.WORLD, CIRCLER.WORLD, AGORACLUB.WORLD,
TANGENTCLUB.WORLD). Configure client IDs/secrets under *.WORLD SSO* and place
the buttons with the SSO shortcodes. Client secrets are entered in wp-admin and
stored encrypted.

---

## Admin pages

The plugin's admin menus are grouped in their own section directly under
**Dashboard**:

| Page                         | Slug                            |
|------------------------------|---------------------------------|
| RT Event → All Tickets       | `rt-event-manager`              |
| Refunds & Cancellations      | `rt-event-manager-refunds`      |
| Transfers                    | `rt-event-manager-transfers`    |
| Event Agenda                 | `rt-event-manager-agenda`       |
| Settings                     | `rt-event-manager-settings`     |
| Badge Template               | `rt-event-badge-template`       |
| Visa Settings                | `rt-event-manager-visa-settings`|
| Visa Letters                 | `rt-event-manager-visa-letters` |
| Apple Wallet                 | `rt-event-manager-apple-wallet` |
| Google Wallet                | `rt-event-manager-google-wallet`|
| .WORLD SSO                   | `world-sso`                     |

All self-posting admin pages use Post/Redirect/Get, so refreshing after a save
never re-submits the form.

---

## Shortcodes

| Shortcode                        | Purpose                                            |
|----------------------------------|----------------------------------------------------|
| `[rt_event_manager_account]`     | The member account portal (set as *My account*).   |
| `[rt_event_manager_checkin]`     | Staff QR check-in web app.                          |
| `[world_sso_login]`              | *Sign in with .WORLD* buttons.                      |
| `[world_sso_register]`           | *.WORLD* registration.                             |
| `[oauth_sso_login]`              | Generic OAuth SSO login buttons.                    |

---

## Database tables

Created on activation (prefixed with your WordPress table prefix):

| Table                       | Contents                                         |
|-----------------------------|--------------------------------------------------|
| `rti_tickets`               | One row per purchased ticket (holder, kind, status, links). |
| `rti_visa_letters`          | Generated visa letters (encrypted applicant PII + PDF).      |
| `rti_pass_registrations`    | Apple Wallet device registrations for push updates.         |
| `oauth_sso_clients`         | Configured `.WORLD` SSO providers.               |
| `mto_attributes`, `mto_attribute_options`, `mto_combination_items` | Make-to-order / configurable ticket attributes. |

---

## REST API

The Apple Wallet **PassKit web service** exposes the standard endpoints under a
`/v1/...` namespace for device registration, pass fetch and logging:

```
GET/POST/DELETE  /v1/devices/{deviceId}/registrations/{passTypeId}[/{serial}]
GET              /v1/passes/{passTypeId}/{serial}
POST             /v1/log
```

These are consumed by Apple Wallet on the device; you do not call them directly.

---

## Privacy & security

- **PII minimisation** — visa-letter applicant data is encrypted at rest and a
  ticket's letters are hard-deleted on cancellation/refund.
- **Certificates & secrets** — Apple/Google wallet certificates, SSO client
  secrets and the wallet password are stored **encrypted**; upload them in
  wp-admin (never commit them).
- **Consent** — explicit privacy-policy acceptance is recorded on registration
  and checkout; an admin re-consent trigger invalidates stored acceptances.
- **Check-in tokens** — the ticket QR encodes a signed check-in token; treat it
  as a credential and do not publish real attendees' QR codes.

---

## Versioning

The plugin follows `MAJOR.MINOR.PATCH`, with one project-specific convention:
the **patch number is the cumulative count of individual changes made since the
last minor bump** (not a sequential counter). For example, six discrete changes
after 2.1.0 ships as 2.1.6. Keep the plugin header `Version:`, the
`RT_EVENT_MANAGER_VERSION` constant and the `CHANGELOG.md` heading in sync.

---

## Development

- **Structure** — bootstrap in `rt-event-manager.php`; feature classes in
  `includes/`; front-end assets in `assets/` (`css/account.css`,
  `js/account.js`).
- **Autoload** — Composer autoloader from `vendor/`; feature classes are
  `require_once`'d from the bootstrap.
- **Linting** — `php -l` each changed PHP file and `node --check` for JS before
  committing.
- **Do not remove** the `.WORLD` SSO module (`class-world-sso.php`,
  `class-admin-settings.php`, `class-oauth-client.php`, `class-user-handler.php`).

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history. The current release is
**2.1.8**.

---

## License

GPL-2.0-or-later. See <https://www.gnu.org/licenses/gpl-2.0.html>.
