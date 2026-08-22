# Changelog

All notable changes to RT Event Manager. Versioning follows semantic
versioning (MAJOR.MINOR.PATCH).

## [2.1.6] — 2026-08-22

Admin-usability and checkout fixes. Backward compatible — no data migrations.
(Patch number reflects the count of individual changes since 2.1.0.)

### Added
- **Own-ticket phone prefill at checkout**: the buyer's own event ticket now
  prefills its phone number from their billing phone.

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
