# Changelog

All notable changes to RT Event Manager. Versioning follows semantic
versioning (MAJOR.MINOR.PATCH).

## [2.2.10] — 2026-09-05

### Fixed
- **Staff & transferred tickets cancelling themselves**: orderless tickets (event
  staff assignments and recoded transfer tickets, stored under `order_id = 0`)
  were silently flagged **invalid** by the status recalculation — it tried to load
  a WooCommerce order 0, got nothing, and treated the ticket as belonging to a
  dead order. The account stayed marked as staff but the ticket disappeared, and
  the same fault made accepted transfers land as an invalid ticket for the
  recipient. Both recalc paths now skip `order_id = 0`, and a one-time repair
  restores any order-0 tickets already wrongly invalidated.

## [2.2.9] — 2026-08-28

### Added
- **Reactivate a declined-refund ticket**: the backend *Refunds & Cancellations*
  page now shows a **Reactivate ticket** action on declined refunds, restoring the
  ticket (and any tours cancelled with it) to confirmed and clearing the refund
  record.

### Changed
- **Order Tickets metabox** redesigned as **stacked cards** (label: value per
  field) for readability instead of a 16-column table; new rows added via *Add
  Ticket* use the same layout.

### Fixed
- **Cancelling a ticket with a pending transfer**: the **Cancel** action is now
  hidden (and blocked server-side) while a transfer offer is pending — withdraw
  the transfer first. Prevents a confusing failed transfer.

## [2.2.8] — 2026-08-28

### Fixed
- **Invalid tickets showing in the member portal**: a ticket whose order is dead
  (cancelled / failed / trashed / deleted / unpaid) is now hidden from the
  dashboard and ticket lists, alongside cancelled/refunded. (Still visible via the
  "show cancelled" toggle / refunds view.)

## [2.2.7] — 2026-08-28

### Fixed
- **Orphaned refund request after an order is deleted**: deleting/trashing an
  order now also **clears** the tickets' refund request (not just marks them
  invalid), so it no longer lingers in the customer's Refunds tab while being
  absent from the backend. The front-end Refunds tab also **hides** any refund
  whose order no longer exists (handles already-orphaned records without a data
  migration).

## [2.2.6] — 2026-08-28

### Fixed
- **White-screen when the QR library is missing/outdated**: `generate_qr_code()`
  now checks for the Endroid `Builder` class and catches `\Throwable` (a
  class-not-found is an `Error`, not an `Exception`, so the old catch missed it).
  A stale `vendor/` now just skips the QR image instead of killing the page.

### Changed
- **Staff ticket names**: assignment resolves the full name from WP first+last,
  then billing first+last (for SSO accounts with empty WP name fields), then the
  display name. A one-time migration upgrades existing staff tickets still on the
  auto-generated first name to the full name (custom names are preserved).
- **Critical error on the dashboard for accounts whose email is a billing address
  on many orders**: reverted the 2.2.4/2.2.5 email-based order match — it pulled in
  tickets from orders billed to that address (for other people) and could crash the
  dashboard render. `get_tickets_for_user()` is back to matching by `owner_user_id`
  plus the account's own orders (now bounded to 300 for safety). Early-bird /
  guest-order surfacing will return via a safer mechanism.

## [2.2.5] — 2026-08-28

### Fixed
- **Blank dashboard for accounts whose email is on many orders** (e.g. the
  convenor): the 2.2.4 email order-match used `limit => -1`, pulling thousands of
  order IDs and exhausting memory in `get_tickets_for_user()` before the dashboard
  rendered. The email lookup is now **bounded (limit 100)** and wrapped fail-safe,
  so it can never break the portal while still surfacing early / guest tickets.

## [2.2.4] — 2026-08-28

Post-release fixes (no schema changes).

### Fixed
- **Early-bird / guest-checkout tickets not shown in the account portal**:
  `get_tickets_for_user()` now also matches the account's orders by **email**, so
  tickets from orders whose `customer_id`/`owner_user_id` were never linked still
  appear.
- **Staff ticket showed only the first name**: assignment now defaults the holder
  to the member's **full name** (first + last), falling back to the display name.
  (Existing staff tickets refresh when re-assigned.)
- **"Log in as member" missing on some profiles**: the target now falls back to
  the **order customer** when a ticket has no `owner_user_id` (legacy rows), and
  an admin-only note explains any remaining reason it is unavailable.
- **"Return to your account" always went to wp-admin**: switching back now returns
  to the **page the support session started from** (e.g. Find Guest), falling back
  to the Users list (wp-admins) or the account portal (managers).

## [2.2.0] — 2026-08-28

Event Staff & per-event check-in. Adds a `staff_role` column to the tickets
table and two new tables (`rti_checkin_sessions`, `rti_checkins`); the schema
migrates automatically (DB version 2.4.0 → 2.5.0).

### Added
- **Event Staff module** (*RT Event → Event Staff*): assign a staff ticket to any
  member account (by email / username / user ID) with one of four roles —
  **Manager** (full access), **Registration manager** (main-event check-in +
  attendee profiles), **Event operator** (pre/day-tour check-in, open/close
  events, participant profiles) and **Regular staff** (no access). One staff
  ticket per account; re-assigning updates the role; Revoke removes it. Staff
  tickets appear on the member's dashboard as a `STAFF` ticket with a QR.
- **Per-event check-in** in the staff PWA:
  - A **session selector** — the always-on **main registration desk** plus one
    session per **tour product + date**.
  - **Main desk**: registration managers (and managers) scan attendee tickets and
    check them into the event (existing behaviour, now role-gated).
  - **Tour sessions**: event operators (and managers) **open** a tour, scan
    attendees as they **board**, and **close** it — closing **confirms
    attendance** and records every unscanned holder as **not-attended**.
  - Access to each session, and to open/close, is gated by the staff role.
- **Tour duties for staff**: assign a pre/day tour to a staff ticket as **Guide**
  or **Supervisor** (RT Event → Event Staff). The duty shows on the staff
  member's dashboard tour list; duty rows are excluded from a tour's attendee
  count and are not marked absent when a session closes. A staff member cannot
  be assigned two tours whose times overlap.
- **Staff-styled tickets & wallet passes**: staff tickets are **navy blue** with a
  **dark-blue** holographic foil on the dashboard, and their Apple Wallet and
  Google Wallet passes are generated in navy (role shown in place of the club).
- **Custom role label**: an optional display name overrides the standard role
  name on the staff ticket and wallet pass (the access level still follows the
  chosen role).
- **"Event Staff" badge** (staff navy) next to the dashboard greeting for staff.
- The **My Calendar** menu is shown to staff too (a later release adds their
  work / shift assignments), and the **Pretour / Day Tours** menus appear for a
  staff member assigned that tour as guide / supervisor.
- A **Check-in** tab under an **Event Management** heading in the account
  navigation embeds the scanning app inside the portal (the menu stays visible) —
  shown only to event operators and above (users with a check-in capability),
  never to regular staff or attendees.
- **Find Guest** (Event Management): search attendees by name, email, phone,
  order or ticket number and view a read-only profile — details, dietary,
  emergency contacts, guardian, everyone they are guardian for, and the status of
  every ticket (pending / confirmed / checked-in). The purchasing (main) account
  is shown as a link to its profile. Managers and registration managers see all
  attendees; a **pure event guide only sees guests booked on the tour(s) they are
  assigned to**.
- **Future member (minor) styling**: cream/secondary card with primary-red
  labels, dark-brown values and a dark-gold holographic foil, applied to the
  dashboard ticket and the Apple / Google Wallet passes.
- **Visa-letter verification (QR)**: each generated letter of invitation carries
  a QR code (and printed link + reference) that opens a no-login page confirming
  a letter with that reference **was issued**, showing the applicant name,
  reference, issue date and a **"View the stored letter (PDF)"** button (the
  exact stored copy) to compare with the presented document. Links are
  **HMAC-signed tokens** (`?rtem_visa=<token>`) so references can't be enumerated;
  the page **states it does not certify the physical document is unaltered**.
  Admin *Visa Letters* gains a **Verify link** column. Public endpoints (the
  verify page and the stored-PDF view) are no-login, token-gated and `noindex`.
- **Log in as member (user switching)**: **WordPress administrators and the event
  Manager role** can switch into a member's account to reproduce/verify issues —
  from the front-end **Find Guest** profile (a "Log in as this member" button)
  and from the *Users* list row action — then switch back from a fixed return
  banner (and the admin bar; managers land back on the account portal). Nonce-
  protected; cannot switch into another administrator or manager; the return is
  proven server-side by a random token → the original user id (an impersonated
  member can never escalate). Fires `rt_event_manager_user_switched` /
  `rt_event_manager_user_switch_back` for auditing.

### Changed
- **Transfer accept now "recodes" the ticket**: accepting a transfer issues a
  brand-new ticket (order 0, new number → new check-in QR) for the recipient and
  marks the original as transferred (cancelled). Linked pre/day tours follow to
  the recoded ticket.
- **Transfer and refund/cancel are disabled** for staff tickets and staff tour
  duties (they are organiser-assigned) — hidden in the member portal and
  rejected server-side.
- Check-in page access is now governed by staff roles (shop managers / admins
  keep full access).

### Fixed
- The **Save button now reliably appears** when editing a ticket row (the
  edit/save toggle no longer gets stuck hidden by the `[hidden]` attribute vs.
  the button's CSS display rule).

## [2.1.8] — 2026-08-22

Admin-usability, checkout and dashboard fixes. Backward compatible — no data
migrations. (Patch number reflects the count of individual changes since 2.1.0.)

### Added
- **Own-ticket phone prefill at checkout**: the buyer's own event ticket now
  prefills its phone number from their billing phone.
- **Holographic dashboard ticket**: a diagonally-cascading micro-print of the
  event name ("ROUND TABLE INTERNATIONAL HALF YEAR MEETING 2027 HOSTED BY ROUND
  TABLE SWITZERLAND") and the motto ("ADOPT. ADAPT. IMPROVE.") covers the whole
  ticket as a dark foil; a red highlight band drifts across it on its own and
  follows the mouse, so the foil catches the light as you move over it. The
  ticket also tilts gently inward toward the pointer like a pressed weight. The
  mascot, QR code and Add-to-Wallet buttons stay crisp above the foil, and the
  QR stays scannable.
- **"Disable motion effects" toggle** beneath the ticket (theme checkbox,
  off by default, remembered per browser): turns off the tilt and hides the
  holographic foil for anyone who prefers a static ticket. `prefers-reduced-
  motion` is honoured automatically.

### Changed
- **Admin menu grouped into its own section**: RT Event and .WORLD SSO now sit
  together directly under Dashboard, set apart by a separator (like the gap
  before WooCommerce), with .WORLD SSO immediately beneath RT Event.
- **Invoice / receipt background image setting moved** from *Visa Settings* to
  *RT Event → Settings* (option unchanged: `rt_event_manager_receipt_bg_img`).

### Fixed
- **No more "resubmit this form?" prompt** when refreshing an admin page after a
  save: every self-posting plugin admin page (Settings, Event Agenda, Refunds,
  Transfers, Visa Settings, Apple Wallet, Google Wallet) now follows the
  Post/Redirect/Get pattern.
- **Ticket edit mode now returns to view mode on Save** instead of staying open
  until a manual refresh (the Save/edit buttons were kept visible by a CSS rule
  overriding the `[hidden]` attribute). Removed the green "saved" checkmark /
  text shown on field exit.
- **Clear error when a tour slot is already booked**: adding a pretour / day
  tour for a slot you already hold now shows a specific message instead of the
  generic "Request failed. Please try again." (the modal also surfaces the
  server's message on non-2xx responses).

## [2.1.0] — 2026-08-22

Large customer-portal, privacy and ticketing update. Backward compatible — no
data migrations or breaking changes.

### Added
- **Redesigned logged-out My Account page**: two-column layout — .WORLD SSO
  ("Login or Register with .WORLD") on the left with an auto-provisioning and
  profile-sync note; local login and a separate registration card on the right.
- **Physical-style event ticket on the dashboard**: brand-red ticket with a
  perforated QR stub, mascot, event date range, guardian line (Future members)
  and Add-to-Wallet buttons — mirroring the Apple Wallet pass, and turning into a
  portrait pass on small screens. New settings: short event name, ticket logo
  URL, mascot URL.
- **Navigation notification badges** on My Profile, Emergency Contact and Event
  Tickets when information is missing, using custom Font Awesome kit icons, a
  light-blue attention background and dark-blue label/icon; required-but-empty
  fields are outlined in red.
- **Privacy-policy re-consent flow**: per-member acceptance record, an admin
  "Require re-consent" trigger with a policy version and a "what changed"
  summary, and a blocking re-consent modal. Explicit "I have read the Privacy
  Policy" consent checkbox on registration and checkout (recorded on the order
  and the member profile).
- **Emergency Contact section**: two contacts (the second locked until the
  primary is complete), save-on-exit with inline confirmation, a re-consent-style
  prompt, and email validation.
- **Themed dropdowns** across the portal and modals: native selects (family,
  dietary, guardian, relationship, country, membership) are enhanced into
  on-brand dropdowns; long lists (country) get type-to-search; the allergy and
  function/role fields become themed autocompletes.
- **Travel & Visa**: request and download/view a letter of invitation from a
  modal; letter generation is blocked until the ticket is personalised;
  permanent-residents wording; and buttons linking to Swiss entry requirements,
  Swiss customs, and the EU EES & ETIAS systems.
- **"Purchase my event ticket"** button when the account has no event ticket,
  going straight to checkout.
- **Per-row edit mode** for Event Tickets: a pencil enters edit mode and a save
  icon commits; locked fields stay read-only.
- Optional A4 letterhead background for invoice/receipt PDFs.
- "Powered by RT Event Manager v.x" tag under the account navigation.

### Changed
- Backend top-level admin menu renamed to "RT Event".
- My Profile and Emergency Contact save on field exit with an inline green
  confirmation (no Save button); Country is a WooCommerce country select and
  first/last name + phone now populate the WooCommerce billing address.
- Ticket-save feedback moved from a page-foot status to inline per-field
  confirmation.
- Field text left-aligned throughout the portal.

### Fixed
- Profile data (country ISO code, first/last name, phone) now prefills the
  checkout billing address correctly.
- Non-personalised tickets can no longer generate a visa letter (client and
  server side).

### Notes
- Cookie-consent gating (WooCommerce Order Attribution + Brevo/WonderPush web
  push) is handled by a separate `rtihym-consent-gate.php` must-use plugin, not
  part of this plugin.

## [2.0.1] — 2026

### Added
- Allow editing the phone number on the account owner's own ticket.

### Fixed
- Customer calendar showed a spurious extra week when the last item ended on a
  Sunday.
- Production Apple Wallet passes not registering (malformed pass update URL —
  configuration fix).

## [2.0.0] — 2026

Initial 2.x release.

### Added
- Custom tabbed **My Account** member portal (Dashboard, Profile, Emergency
  Contact, Event Tickets, Pretours, Day Tours, Travel & Visa, Shop, Orders,
  Refunds, Calendar), replacing the default WooCommerce account output.
- **Apple Wallet & Google Wallet** event passes with a live update push service
  (APNs / Google PATCH) triggered on status, tour and holder changes.
- **Visa letter of invitation** generation (encrypted PII, hard-deleted on
  cancel/refund).
- Customer-facing **Refunds** tab and admin refund decisions with notes.
- Order receipt/invoice PDFs.
- Ticket transfers, co-traveller and Future-member (minor) tickets, check-in
  status reconciliation.
