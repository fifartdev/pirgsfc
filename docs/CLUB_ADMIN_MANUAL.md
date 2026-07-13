# PYRGOS AFC — Club Admin Panel User Manual

**Panel URL:** `/club-admin`  
**Audience:** Club admins and superadmins  
**Language note:** All on-screen labels are in Greek. This manual quotes them exactly as they appear.

---

## Table of Contents

1. [Logging In](#1-logging-in)
2. [Dashboard](#2-dashboard)
3. [Seasons (Σεζόν)](#3-seasons-σεζόν)
4. [Teams (Ομάδες)](#4-teams-ομάδες)
5. [Leagues (Διοργανώσεις)](#5-leagues-διοργανώσεις)
6. [Venues (Γήπεδα)](#6-venues-γήπεδα)
7. [Players (Παίκτες)](#7-players-παίκτες)
8. [Staff (Τεχνική Ομάδα)](#8-staff-τεχνική-ομάδα)
9. [Rosters (Ρόστερ)](#9-rosters-ρόστερ)
10. [Matches (Αγώνες)](#10-matches-αγώνες)
11. [Standings (Βαθμολογία)](#11-standings-βαθμολογία)
12. [News (Νέα)](#12-news-νέα)
13. [Settings (Ρυθμίσεις)](#13-settings-ρυθμίσεις)
14. [Page Content — Home/About/Contact](#14-page-content--homeaboutcontact)
15. [Important Rules](#15-important-rules)

---

## 1. Logging In

Navigate to `/club-admin/login` and enter your email and password.

- Only accounts with the `club_admin` or `superadmin` role can log in here.
- On success you are redirected to the Dashboard.
- To log out, click **"Αποσύνδεση"** in the sidebar at the bottom-left.

> **Forgot your password?** Contact the site superadmin — there is no self-serve password reset in the club panel. The superadmin can update your password in the Payload admin panel.

---

## 2. Dashboard

The dashboard (`/club-admin/dashboard`) gives you a live snapshot of the site:

| Card | What it shows |
|------|---------------|
| **Αγώνες** | Total number of matches in the database |
| **Παίκτες** | Total number of players in the database |
| **Νέα** | Total number of news articles |

Below the stat cards you'll find:

- **Επερχόμενοι Αγώνες** — the next 5 scheduled matches, sorted by date. Click any row to edit it.
- **Πρόσφατα Νέα** — the 5 most recently dated news articles with their publication status. Click any row to edit.
- **Γρήγορες ενέργειες** — shortcut buttons to create a new article, match, player, or roster entry.

---

## 3. Seasons (Σεζόν)

Path: `/club-admin/seasons`

Seasons are the backbone of the data model. Every match and roster entry belongs to a season.

### Create a season

1. Click **"Νέα Σεζόν"**.
2. Fill in:
   - **Τίτλος** — e.g. `2025-2026` (required)
   - **Έτος έναρξης / Έτος λήξης** — four-digit years (required)
   - **Κατάσταση** — `Πρόχειρο` (draft) | `Ενεργή` (active) | `Αρχειοθετημένη` (archived)
   - **Τρέχουσα σεζόν** — tick this checkbox for the currently running season. Only one season should be marked current at a time.
   - **Περιγραφή** — optional internal notes.
3. Click **"Αποθήκευση"**.

### Edit a season

Click the pencil icon or the season row to open the edit form. The same fields are available.

> **Never delete a season** that already has matches or rosters linked to it. Deleting it will break those records. Use the `Αρχειοθετημένη` status to retire old seasons.

---

## 4. Teams (Ομάδες)

Path: `/club-admin/teams`

Teams represent the three PYRGOS AFC squads: Men, Women, and Futsal. They should already exist from the initial setup. You will rarely need to add new ones.

### Fields

| Field | Notes |
|-------|-------|
| **Όνομα / Name (EN)** | Greek and English team name |
| **Slug** | URL-friendly identifier, e.g. `pyrgos-afc-men` — must be unique |
| **Τμήμα (Department)** | `Ανδρών`, `Γυναικών`, or `Futsal` |
| **Λογότυπο** | Team logo shown on the website — upload via the image picker |
| **Κατάσταση** | `Ενεργή` or `Ανενεργή` |

The team logo is displayed on the `/men`, `/women`, and `/futsal` public pages next to the section heading.

---

## 5. Leagues (Διοργανώσεις)

Path: `/club-admin/leagues`

Leagues (competitions) are referenced by matches. Create one entry per competition — e.g. "Football League 2", "EPSH Cup".

### Fields

| Field | Notes |
|-------|-------|
| **Όνομα / Name (EN)** | Greek and English competition name |
| **Slug** | URL-friendly identifier |
| **Επίπεδο** | Competition tier: e.g. `Γ' Εθνική`, `Τοπική` |
| **Χώρα / Περιοχή** | Country and region |
| **Κατάσταση** | `Ενεργή` or `Ανενεργή` |

---

## 6. Venues (Γήπεδα)

Path: `/club-admin/venues`

Venues are the stadiums or pitches where matches are played.

### Fields

| Field | Notes |
|-------|-------|
| **Όνομα / Name (EN)** | Greek and English venue name |
| **Slug** | URL-friendly identifier |
| **Τύπος** | `Στάδιο` (stadium) or `Γήπεδο` (pitch) |
| **Πόλη / Χώρα / Διεύθυνση** | Location details |
| **Χωρητικότητα** | Seat capacity (optional) |

---

## 7. Players (Παίκτες)

Path: `/club-admin/players`

### Create a player

1. Click **"Νέος Παίκτης"**.
2. Fill in the required fields: **Όνομα** (first name), **Επώνυμο** (last name), **Θέση** (position).
3. Optionally add English names, nationality, preferred foot, and status.
4. Click **"Αποθήκευση"**. The player is created and you are returned to the list.

> The player photo cannot be added during creation. After saving, click the player row to open the edit form and upload the photo there.

### Edit a player & upload a profile photo

1. Click the pencil icon next to a player.
2. Update any text fields as needed.
3. To add or replace a photo, find the **"Φωτογραφία παίκτη"** section:
   - Click **"Επιλογή εικόνας"** to open the file browser.
   - Select a JPG, PNG, or WebP file. The image uploads immediately.
   - A preview appears in the 192×144 px box.
   - To remove the photo, click the **×** button in the top-right corner of the preview.
4. Click **"Αποθήκευση"**. A green success banner confirms the save.

### Player fields

| Field | Notes |
|-------|-------|
| **Όνομα / Επώνυμο** | Greek first and last name (required) |
| **Όνομα / Επώνυμο (αγγλ.)** | English names — used to generate the URL slug |
| **Θέση** | `Τερματοφύλακας` · `Αμυντικός` · `Μέσος` · `Επιθετικός` |
| **Εθνικότητα** | Greek and English |
| **Προτιμώμενο πόδι** | `Δεξί` · `Αριστερό` · `Αμφίπλευρος` |
| **Αρ. φανέλας** | Default shirt number (1–99) |
| **Ύψος / Βάρος** | cm and kg |
| **Κατάσταση** | `Ενεργός` · `Ανενεργός` · `Μεταγραφή` · `Απόσυρση` |
| **Φωτογραφία παίκτη** | Profile photo — shown on the team roster pages |

### Player statuses

| Status | Public visibility |
|--------|------------------|
| `Ενεργός` | Visible to everyone |
| `Ανενεργός` | Hidden from public, visible to logged-in admins |
| `Μεταγραφή` | Hidden from public |
| `Απόσυρση` | Hidden from public |

---

## 8. Staff (Τεχνική Ομάδα)

Path: `/club-admin/staff`

Staff members are the coaching and support team (coaches, physiotherapists, etc.).

### Fields

| Field | Notes |
|-------|-------|
| **Όνομα / Επώνυμο** | Greek first and last name (required) |
| **Όνομα / Επώνυμο (αγγλ.)** | English names |
| **Ρόλος (ελλ. / αγγλ.)** | Job title in Greek and English, e.g. `Προπονητής` / `Head Coach` |
| **Κατάσταση** | `Ενεργός` or `Ανενεργός` |

Staff members are assigned to teams via **Staff Assignments** (not covered separately — managed by the superadmin).

---

## 9. Rosters (Ρόστερ)

Path: `/club-admin/rosters`

A roster entry links one player to one team for one season. This is how the website knows which players belong to which squad in a given year.

### Create a roster entry

1. Click **"Νέα Εγγραφή Ρόστερ"**.
2. Select:
   - **Σεζόν** — the season (required)
   - **Ομάδα** — the PYRGOS AFC team, e.g. Men / Women / Futsal (required)
   - **Παίκτης** — the player (required)
3. Optionally set:
   - **Νούμερο φανέλας** — shirt number for this season (overrides the player's default)
   - **Ημ. εγγραφής** — date the player joined this roster
   - **Αρχηγός / Αντιαρχηγός** — captain / vice-captain checkboxes
   - **Κατάσταση** — `Ενεργός` · `Δανεισμός` · `Μεταγραφή` · `Τραυματίας` · `Ανενεργός`
   - **Στατιστικά σεζόν** — appearances, goals, assists, yellow cards, red cards, minutes played, and clean sheets (goalkeepers only) *for this player, on this team, this season*. Shown on the player's public profile page. Leave clean sheets empty for outfield players.
4. Click **"Αποθήκευση"**.

> A player can appear in multiple roster entries — for example, the same player can be in both the Men's and Futsal rosters in the same season. Each roster entry has its own independent stats, since the same player's numbers for the Men's team aren't the same as for Futsal.

> **Why stats live here and not on the player's own profile:** a player's appearances/goals/etc. are specific to one team in one season, not a fixed property of the player. Update them as the season progresses via the roster entry's edit form.

---

## 10. Matches (Αγώνες)

Path: `/club-admin/matches`

### Create a match

1. Click **"Νέος Αγώνας"**.
2. Fill in the required fields:

   | Field | Notes |
   |-------|-------|
   | **Σεζόν** | Which season this match belongs to |
   | **Ομάδα PYRGOS AFC** | Which of our squads is playing |
   | **Διοργάνωση** | The league or competition |
   | **Γηπεδούχος / Φιλοξενούμενος** | Full team names as they should appear on the website |
   | **Ημερομηνία** | Match date |

3. Optional fields:

   | Field | Notes |
   |-------|-------|
   | **Γήπεδο** | Venue (select from the Venues list) |
   | **Τύπος αγώνα** | `Πρωτάθλημα` · `Κύπελλο` · `Φιλικό` · `Τουρνουά` · `Play-off` |
   | **Ώρα έναρξης** | Kickoff time, e.g. `19:30` |
   | **Αγωνιστική / Φάση** | Round label, e.g. `16η Αγωνιστική` |
   | **Εντός έδρας** | Tick if PYRGOS AFC is the home side |
   | **Κατάσταση** | `Προγραμματισμένος` · `Ολοκληρώθηκε` · `Αναβλήθηκε` · `Ακυρώθηκε` |

4. Click **"Αποθήκευση"**.

### Match statuses and the website

| Status | Website display |
|--------|----------------|
| `Προγραμματισμένος` | Shows in "Upcoming matches" |
| `Ολοκληρώθηκε` | Shows in "Results" |
| `Αναβλήθηκε` / `Ακυρώθηκε` | Treated as upcoming (no result shown) |

---

## 11. Standings (Βαθμολογία)

Path: `/club-admin/standings`

A league table is one document per competition, per season, holding every team's row together as a single editable table — not one document per team. The public `/standings` page shows one such table per competition, in row order.

> **This is entered by hand, not calculated automatically.** The site only records PYRGOS AFC's own match results — it has no data about matches between other clubs — so there is no way to compute a full league table automatically. Update the table yourself from the official league standings whenever they change (after each matchday, typically).

### Create a league table

1. Click **"Δημιουργία"**.
2. Select **Σεζόν** and **Διοργάνωση** (both required), then click **"Δημιουργία & συνέχεια"**. This creates an empty table and opens it for editing.

### Edit a league table

Path: `/club-admin/standings/<id>`

- Click **"Προσθήκη ομάδας"** to add a new row. Each row has: **Ομάδα (ελλ. / αγγλ.)** (free text — rival clubs aren't managed elsewhere in this panel), **Ο PYRGOS AFC** (tick for PYRGOS AFC's own row — highlighted on the public page), **Αγώνες / Νίκες / Ισοπαλίες / Ήττες**, **Γκολ υπέρ / Γκολ κατά**, **Βαθμοί**, and optional **Σημειώσεις** (e.g. a points deduction — shown under the team's name publicly).
- **The row order IS the standing position** — there's no separate position number to keep in sync. Use the ↑ / ↓ buttons on each row to reorder; the first row is 1st place.
- Use the trash icon on a row to remove that team, or **"Διαγραφή πίνακα"** at the top to delete the whole table.
- Click **"Αποθήκευση αλλαγών"** to save. Nothing is written until you save.

> You need one row per team in the table, not just PYRGOS AFC's — add every team for the table to display correctly. Only tables belonging to the **current season** (the one marked "Τρέχουσα σεζόν" under Seasons) are shown publicly.

### Team stats (separate from standings)

Each department page (`/men`, `/women`, `/futsal`) also shows a "Season Record" block — PYRGOS AFC's own played/won/drawn/lost/goal difference/points. Unlike Standings, **this is calculated automatically** from the Matches you've already entered with the `Ολοκληρώθηκε` status and a final score — there's nothing to fill in for it separately.

---

## 12. News (Νέα)

Path: `/club-admin/news`

### Create an article

1. Click **"Νέο Άρθρο"**.
2. Fill in:
   - **Τίτλος (ελλ.)** — Greek headline (required)
   - **Τίτλος (αγγλ.)** — English headline (used to generate the article's URL slug)
   - **Περίληψη** — short teaser shown on the news listing page (Greek and English)
   - **Συγγραφέας** — author name in Greek and English
   - **Ημερομηνία δημοσίευσης** — publish date
   - **Κατάσταση** — start with `Πρόχειρο` (draft)
   - **Κύρια εικόνα άρθρου** — optional featured image. Click **"Επιλογή εικόνας"** to open the file browser and select a JPG, PNG, or WebP file; it uploads immediately and a preview appears. You can also add or replace it later from the edit form.
3. Click **"Αποθήκευση"**. The article is created and you return to the list.

Both the Greek and English rich text body (the full article content) are editable directly in this panel — see the **"Περιεχόμενο"** editor on the create/edit form.

### Edit an article & upload a featured image

1. Click the pencil icon next to an article.
2. Update any text fields as needed.
3. To add or replace the featured image for the article card and header, find the **"Κύρια εικόνα άρθρου"** section:
   - Click **"Επιλογή εικόνας"** to open the file browser.
   - Select a JPG, PNG, or WebP file. The image uploads immediately and a preview appears.
   - To remove the image click the **×** on the preview.
4. Click **"Αποθήκευση"**. A green success banner confirms the save.

### Article statuses

| Status | Effect |
|--------|--------|
| `Πρόχειρο` | Only visible to logged-in admins. Not shown on the public site. |
| `Δημοσιευμένο` | Visible to everyone on the public `/news` page. |
| `Αρχειοθετημένο` | Hidden from both public and admin listings. The record is preserved. |

> **Tip:** Set the **Ημερομηνία δημοσίευσης** to today's date when publishing so the article sorts correctly on the news listing.

---

## 13. Settings (Ρυθμίσεις)

Three screens under the sidebar's **Πληροφορίες Συλλόγου**, **Προεπιλογές SEO**, and (superadmin-only) **Ρυθμίσεις Ιστότοπου** — each edits a single site-wide document, not a list. Saving revalidates every public page immediately.

### Πληροφορίες Συλλόγου — `/club-admin/settings/club-info`

Editable by both club_admin and superadmin. Covers everything the public site's footer, About, and Contact pages read from: official name, logo, club colors, stadium info, contact details, social media links, the "About the club" rich text (Greek/English), **Αξίες συλλόγου** (club values — add/reorder/remove rows, same repeatable-row pattern as Standings), and **Χορηγοί** (sponsors — add/reorder/remove rows, each with its own logo upload).

### Προεπιλογές SEO — `/club-admin/settings/seo`

Editable by both club_admin and superadmin. Default page title/description, the default social-sharing (Open Graph) image, Twitter handle, `robots.txt` directives, and the basic structured-data (JSON-LD) fields used when a specific page doesn't set its own.

### Ρυθμίσεις Ιστότοπου — `/club-admin/settings/site` (superadmin only)

Not shown in the sidebar for club_admin accounts, and the page itself blocks access if visited directly. This is where the sitewide kill-switches live: **Λειτουργία συντήρησης** (maintenance mode) and **Ενεργοποίηση αγγλικής γλώσσας** (the bilingual toggle — see [Bilingual content](#bilingual-content) below), plus Google Analytics ID, the cookie banner toggle, and the announcement bar.

---

## 14. Page Content — Home/About/Contact

Three screens — **Περιεχόμενο Αρχικής**, **Περιεχόμενο — Σχετικά**, **Περιεχόμενο — Επικοινωνία** — for the narrative copy on the homepage, About page, and Contact page. Editable by both club_admin and superadmin.

**Scope: narrative content only, not UI chrome.** These screens cover the prose each page owns directly — hero copy, mission/story text, blurbs, the closing quote on About, department descriptions on Contact. They do **not** cover: shared section headings owned by reusable components (e.g. the "Αξίες συλλόγου"/values heading, edited under [Πληροφορίες Συλλόγου](#13-settings-ρυθμίσεις) instead), button labels, nav labels, or other chrome text — those remain fixed in the site's code.

**Every field is optional and falls back independently.** Leave a field blank and that page keeps showing today's copy — nothing breaks, nothing goes empty. This means it's safe to fill in only the fields you actually want to change. When you open one of these screens, the form is pre-filled with whatever text is *currently live* (your own past edit, or today's default copy if you've never edited it) — not blank fields — so you're always editing the real thing.

### Περιεχόμενο Αρχικής — `/club-admin/content/home`

The homepage hero only: eyebrow, two-part title (with an emphasized middle segment) and body text, in Greek and English. The rest of the homepage (next match, results, departments, players, values, news, sponsors, call-to-action) is either live data or shared content edited elsewhere.

### Περιεχόμενο — Σχετικά — `/club-admin/content/about`

Covers, in order: Hero, Mission (heading + 3 paragraphs), Στατιστικά (the four headline numbers — founding year, player count, age groups, stadium capacity; same value shown in both languages), Ιστορία (heading + a **Χρονολόγιο** timeline — add/reorder/remove events the same way as Standings rows), Γήπεδο blurb, Φίλαθλοι & Κοινότητα blurb, and the closing **Απόφθεγμα** (quote, name, role).

### Περιεχόμενο — Επικοινωνία — `/club-admin/content/contact`

Covers: Hero, the four fixed **Τμήματα Επικοινωνίας** (General/Media/Sponsorships/Academy — each with its own title, description, and contact email), and the heading text above the contact form and the "club details" list. The actual address/phone/main email/social links shown on the page come from [Πληροφορίες Συλλόγου](#13-settings-ρυθμίσεις), not from here.

---

## 15. Important Rules

### Records are never deleted

The system is designed to preserve historical data. Use status fields to retire outdated records:
- Old seasons → `Αρχειοθετημένη`
- Transferred players → `Μεταγραφή`
- Old articles → `Αρχειοθετημένο`

Do not delete seasons, players, or matches if they have dependent records (rosters, results). This protects the club's historical archive.

### Image uploads

- Supported formats: JPG, PNG, WebP, GIF
- Maximum practical size: keep files under 5 MB for fast page loads; aim for under 2 MB when possible
- Player photos display best in portrait orientation (taller than wide, roughly 3:4 ratio)
- News featured images display best in landscape orientation (wider than tall, roughly 16:9 or 3:2 ratio)
- The upload happens immediately when you select a file — no need to do anything extra before saving the form

### Bilingual content

The public website supports Greek (`/el/`) and English (`/en/`). For content to appear in both languages, fill in both the Greek and English fields. If the English field is left blank, the Greek text is used as a fallback on the English version of the site.

English can be turned off site-wide (e.g. while English content isn't ready): every `/en/...` page redirects to the Greek homepage, the language switcher disappears from the header, and English pages are removed from the sitemap so search engines stop offering them. This is the **"Ενεργοποίηση αγγλικής γλώσσας"** setting, under [Ρυθμίσεις Ιστότοπου](#13-settings-ρυθμίσεις) — superadmin only.

### Slugs and URLs

Slugs (URL identifiers) are automatically generated from the English name when a record is first created. They cannot be changed afterwards from this panel. If a slug needs correcting, contact the superadmin.

### Access limits

Club admins have access to all sections of this panel, including editing article body content (rich text). They **cannot**:
- Access the Payload superadmin panel at `/admin`
- Delete records from the database
- Change user passwords or roles

These operations are reserved for the superadmin.
