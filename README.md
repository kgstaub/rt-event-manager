# RT Event Manager

[![Version](https://img.shields.io/badge/version-2.3.10-blue?style=flat-square)](CHANGELOG.md)
[![Tests · WordPress 7.x](https://img.shields.io/badge/WordPress%207.x-Tests%20Passing-brightgreen?style=flat-square&logo=wordpress&logoColor=white&labelColor=21759B)](#requirements)
[![Tests · WooCommerce 11.x](https://img.shields.io/badge/WooCommerce%2011.x-Tests%20Passing-brightgreen?style=flat-square&logo=woocommerce&logoColor=white&labelColor=7F54B3)](#requirements)
[![License](https://img.shields.io/badge/license-GPL--2.0--or--later-blue?style=flat-square)](https://www.gnu.org/licenses/gpl-2.0.html)

Round Table International event management for **WordPress + WooCommerce**.

RT Event Manager turns a WooCommerce store into a complete event platform: it sells
attendee tickets, gives every member a purpose-built account portal (dashboard,
profile, tours, event calendar, order history, visa letters and a merch shop),
handles pretours & day tours, ticket transfers and refund requests, issues
**Apple Wallet** and **Google Wallet** passes with live push updates, prints
attendee badges, generates PDF receipts/invoices and letters of invitation, and
ships a **staff QR check-in web app** with event-staff management. Members can
open support requests through a **FreeScout helpdesk** tab, and numbered
**challenge coins** can be sold one number at a time. It also bundles a *Sign in with .WORLD*
SSO module for Round Table's identity providers.

- **Version:** 2.3.10
- **Requires:** WordPress 5.0+, PHP 7.4+, WooCommerce 5.0+
- **Tested up to:** WordPress 7.x, WooCommerce 11.x
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
- [Helpdesk](#helpdesk)
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
  order history with PDF receipts, travel & visa, a merch shop and a helpdesk.
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
- **Event Staff** — assign a staff ticket with a custom role label to any member;
  staff get navy tickets and wallet passes, per-event staff check-in and tour
  duties (Guide). Admins can *log in as a member* from the check-in app's
  *Find Guest* search and switch back safely.
- **Associations & delegates** — a member's association is derived from their
  `.WORLD` club subdomain (overridable when not SSO-derived). Members can request
  delegate status, which is approved in *RT Event → Delegates* (hosting-family
  eligibility, at most two delegates per association).
- **Helpdesk (FreeScout)** — a *Get help* portal tab where members open
  topic-tagged support tickets and continue them in a chat-style view, with file
  attachments both ways and an unread-reply badge.
- **Numbered challenge coins** — a product flagged as a coin sells each number
  once; the buyer picks a free number, it is reserved in the cart for 60 minutes,
  claimed on order and released if the order is cancelled, failed or refunded.
  The number is printed on the receipt.
- **Hide from main shop** — a product flag that keeps an item out of the main
  WooCommerce shop and search; it stays in the member-portal Shop and via its
  direct link.
- **Privacy-policy consent** — explicit consent on registration and checkout,
  recorded per member and per order, with an admin "require re-consent" trigger.
- **Sign in with .WORLD** — bundled OAuth SSO for Round Table's world identity
  providers (TABLER, 41ER, CIRCLER, AGORACLUB, TANGENTCLUB).
- **Partial (day-only) admissions** — mark a ticket product as a *main event
  admission* and give it a date window (Start/End) to sell day-only passes (e.g.
  "Friday only") alongside the full pass. Each person may hold only one admission
  (full **or** partial — enforced across the order and the account), partial
  tickets restrict their day tours (and forbid pretours) to the valid window, and
  check-in is blocked outside it. Partial tickets show in emerald green with their
  own date; all four card colours (full / partial / staff / Future member) are
  configurable in admin.
- **Ticket-type chooser** — when more than one admission type is on offer, the
  cart "Add another attendee" button and the account "Add a ticket" modal let the
  buyer pick full vs day-only instead of adding a fixed product.
- **Public event calendar** — the `[rt_event_manager_calendar]` shortcode shows
  every listed pretour, day tour and agenda item on any page, no login required.
- **YOOtheme Pro dynamic content** — events are exposed as a Builder source
  ("RT Events") so List/Grid elements can bind to them.
- **SBB timetable widget** — the `[rt_sbb_timetable]` shortcode embeds the
  official SBB connection search (with affiliate tracking) on a page.

---

## Requirements

| Component     | Minimum   | Tested up to |
|---------------|-----------|--------------|
| WordPress     | 5.0+      | 7.x          |
| PHP           | 7.4+      | 8.3          |
| WooCommerce   | 5.0+      | 11.x         |
| PHP extensions| `gd`/`imagick`, `openssl`, `zip` | — |

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

### Main event admissions (full & partial)

An `event` product can be flagged **Main event admission** (`_rti_main_admission`)
and given a **Start/End** window. This makes it a mutually-exclusive admission:

- **One per person** — a person may hold only one admission (full **or** partial),
  enforced across the order and the buyer's account (matched by `.WORLD` ID or
  holder name). Buying admissions for other named attendees is still allowed.
- **Full vs partial** — the widest admission on offer is "full"; a product whose
  window covers fewer days is "partial" (e.g. a Friday-only pass). A partial
  admission is shown in emerald green with its own date.
- **Partial restrictions** — a partial admission cannot include a **pretour**, and
  a **day tour** can be added only when its whole Start–End falls inside the
  admission's window. Main-desk check-in is refused outside the valid day(s).

A ticket bought for another person (holder name ≠ the buyer) is treated as a
co-traveller: it keeps its own details and does not inherit the buyer's `.WORLD`
ID, and it appears under *Travelling with me* rather than *My Ticket*.

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
- **Shop** — merch/regalia (non-ticket products) in the configured category,
  including products hidden from the main shop.
- **Get help** — FreeScout support tickets with chat view and attachments
  (shown when the helpdesk is enabled under *RT Event → Helpdesk*).

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

## Helpdesk

Under *RT Event → Helpdesk* enable the *Get help* tab and set the FreeScout URL,
API key (stored encrypted) and mailbox. Members submit requests with a topic
(general, tours, HYM, payment & refunds, travel support); each becomes a
FreeScout conversation with the member's name, function, club, orders and
tickets attached, tagged by topic. Attachments (images, PDF, Word, Excel — up
to 5 files, 10 MB each) are proxied server-side, and every read or reply is
checked to belong to the signed-in member.

---

## Visa letters of invitation

Under *RT Event → Visa Settings* configure the host details, two signatories,
an optional full-page A4 letterhead background and a German letter template with
placeholders (`{applicant_name}`, `{event_start}`, `{arrival}`, …). Letters are
generated per applicant as PDFs and listed under *RT Event → Visa Letters*.
The member-portal *Travel & Visa* information panel, its external links, the PDF
contact-row labels and the letter date format are also editable there, so a host
in another country can replace the Switzerland-specific defaults. Every letter
carries a QR linking to a public verification page.
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
| Delegates                    | `rt-event-manager-delegates`    |
| Event Agenda                 | `rt-event-manager-agenda`       |
| Settings                     | `rt-event-manager-settings`     |
| Badge Template               | `rt-event-badge-template`       |
| Event Staff                  | `rt-event-manager-staff`        |
| Helpdesk                     | `rt-event-manager-helpdesk`     |
| Visa Settings                | `rt-event-manager-visa-settings`|
| Visa Letters                 | `rt-event-manager-visa-letters` |
| Apple Wallet                 | `rt-event-manager-apple-wallet` |
| Google Wallet                | `rt-event-manager-google-wallet`|
| .WORLD SSO                   | `world-sso`                     |

All self-posting admin pages use Post/Redirect/Get, so refreshing after a save
never re-submits the form.

**Settings → Ticket Appearance** also includes colour pickers for the dashboard
ticket cards — full admission, partial (day-only) admission, staff, and Future
member — each defaulting to the built-in red / emerald / navy / gold.

Billing country is never silently defaulted to the store's base country: it is
taken from the member's `.WORLD` profile when valid, otherwise left blank and
required at checkout.

---

## Shortcodes

| Shortcode                        | Purpose                                            |
|----------------------------------|----------------------------------------------------|
| `[rt_event_manager_account]`     | The member account portal (set as *My account*).   |
| `[rt_event_manager_calendar]`    | Public event calendar (all listed events; no login). Optional `title`. |
| `[rt_event_manager_checkin]`     | Staff QR check-in web app.                          |
| `[rt_sbb_timetable]`             | Embed the SBB timetable/connection search (see below). |
| `[world_sso_login]`              | *Sign in with .WORLD* buttons.                      |
| `[world_sso_register]`           | *.WORLD* registration.                             |
| `[oauth_sso_login]`              | Generic OAuth SSO login buttons.                    |

### `[rt_sbb_timetable]`

Embeds the official SBB (Swiss Federal Railways) connection search. Give it a
**dedicated page** — the SBB bundle ships a broad CSS reset, and assets load only
on pages that contain the shortcode.

| Attribute   | Default   | Notes                                                         |
|-------------|-----------|---------------------------------------------------------------|
| `from`      | *(empty)* | Prefill the From station, e.g. `from="Zürich HB"`.            |
| `to`        | *(empty)* | Prefill the To station.                                       |
| `date`      | *(empty)* | Prefill the date, Swiss format `DD.MM.YYYY` (e.g. `18.02.2027`). |
| `time`      | `13:30`   | Prefill the time, 24-hour `HH:MM`.                            |
| `lang`      | *(auto)*  | SBB language: `de` / `fr` / `it` / `en` (auto-detected from the page otherwise). |
| `title`     | *(empty)* | Optional heading above the widget.                            |
| `banner`    | `none`    | Product teaser: `none`, `swiss-travel-pass`, `saver-day-pass`, `railaway`. |
| `affiliate` | *(empty)* | SBB affiliate tracking code; also settable site-wide via the `rt_event_manager_sbb_affiliate_code` filter. |

Example:

```
[rt_sbb_timetable from="Zürich Flughafen" to="Winterthur" date="18.02.2027" time="16:00" affiliate="RTI2027"]
```

---

## Database tables

Created on activation (prefixed with your WordPress table prefix):

| Table                       | Contents                                         |
|-----------------------------|--------------------------------------------------|
| `rti_tickets`               | One row per purchased ticket (holder, kind, status, links). |
| `rti_visa_letters`          | Generated visa letters (encrypted applicant PII + PDF).      |
| `rti_pass_registrations`    | Apple Wallet device registrations for push updates.         |
| `rti_checkin_sessions`, `rti_checkins` | Staff check-in sessions and per-ticket check-in records. |
| `rti_coin_claims`           | Reserved and claimed challenge-coin numbers.     |
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
  secrets, the FreeScout API key and the wallet password are stored **encrypted**; upload them in
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

See [CHANGELOG.md](CHANGELOG.md) for the full history and
[RELEASE_NOTES.md](RELEASE_NOTES.md) for the latest highlights. The current
release is **2.3.10**.

---

## License

GPL-2.0-or-later. See <https://www.gnu.org/licenses/gpl-2.0.html>.
