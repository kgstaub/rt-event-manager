# RT Event Manager — Release Notes

## 2.1.8 — 22 August 2026

An admin-usability, checkout and dashboard release. **Backward compatible** — no
database migrations and no breaking changes. Safe to update in place.

> This is a patch release. Per the project's versioning convention, the patch
> number is the cumulative count of individual changes since 2.1.0 — this build
> gathers everything landed since then.

### ✨ Highlights

**Holographic dashboard ticket.** The member dashboard ticket now has a subtle
red foil hologram: the event name ("ROUND TABLE INTERNATIONAL HALF YEAR MEETING
2027 HOSTED BY ROUND TABLE SWITZERLAND") and the motto ("ADOPT. ADAPT. IMPROVE.")
are micro-printed in a diagonally-cascading pattern across the whole ticket. A
red highlight drifts across it on its own and follows the mouse, so the foil
catches the light as you move over it, and the ticket tilts gently inward toward
the pointer like a pressed weight. The mascot, QR code and Add-to-Wallet buttons
stay crisp above the foil, and the QR remains scannable.

**"Disable motion effects" toggle.** A small checkbox under the ticket (styled to
match the theme) turns the motion off — no tilt and no hologram, just a static
ticket. It's **off by default**, remembered per browser, and the plugin also
respects the operating-system "reduce motion" setting automatically.

### 🆕 New

- **Own-ticket phone prefill at checkout** — when buying your own event ticket,
  the phone field is pre-filled from your billing phone.

### 🔧 Improvements

- **Admin menus grouped into their own section** — RT Event and .WORLD SSO now
  sit together directly beneath *Dashboard*, set apart by a separator (like the
  gap before WooCommerce), with .WORLD SSO immediately below RT Event.
- **Invoice / receipt background moved** — the full-page A4 letterhead behind the
  receipt/invoice PDFs is now set under *RT Event → Settings* instead of
  *Visa Settings*. The stored value is unchanged, so existing letterheads carry
  over with no action needed.

### 🐛 Fixes

- **No more "resubmit this form?" prompt** — refreshing an admin page after
  saving no longer asks to re-send the form. Every self-posting plugin page
  (Settings, Event Agenda, Refunds, Transfers, Visa Settings, Apple Wallet,
  Google Wallet) now redirects after saving.
- **Ticket edit mode returns to view mode on Save** — editing a ticket in the
  portal and pressing Save now closes the editor immediately instead of staying
  open until a manual refresh. The green "saved" checkmarks on field exit were
  removed.
- **Clear "slot already booked" message** — adding a pretour or day tour for a
  time slot you already hold now shows a specific message ("You already have a
  … booked for this time slot") instead of a generic failure.

### 📋 For administrators / upgrading

- No configuration changes are required. The invoice/receipt background setting
  simply appears under *RT Event → Settings* now.
- Existing tickets, orders, wallet passes and visa letters are unaffected.
- If members prefer a static ticket, point them at the **Disable motion effects**
  checkbox under the dashboard ticket.

See [CHANGELOG.md](CHANGELOG.md) for the itemised change list.
