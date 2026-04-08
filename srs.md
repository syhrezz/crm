# Complete CRM System — Final SRS & Agent Prompt

---

## 🧾 Agent Prompt (Copy-Paste Ready)

```
Create a fully functional CRM prototype using HTML, Tailwind CSS, and vanilla JavaScript.
No backend required — use localStorage for all data persistence. The system must feel like
a real, production-ready enterprise CRM. Use Chart.js, SheetJS, Leaflet.js, and jsPDF via CDN.

===========================================================================================
## SYSTEM ARCHITECTURE
===========================================================================================

Multi-page HTML structure (grouped by role):

  ── SHARED: AUTH ──────────────────────────────────────────────
    /login.html
    /forgot-password.html
    /reset-password.html
    /first-time-setup.html         ← first-login force-change password

  ── SHARED: SYSTEM ────────────────────────────────────────────
    /403.html
    /404.html
    /help.html                     ← all roles

  ── SHARED: JS UTILITIES ──────────────────────────────────────
    /js/utils.js                   ← formatCurrency, formatDate, showToast,
                                      showModal, sessionGuard, etc.
    /js/layout.js                  ← renders sidebar + topbar based on role
    /js/seed.js                    ← mock data seeding on first load

  ── ROLE: SALES ───────────────────────────────────────────────
    /sales/index.html              ← dashboard
    /sales/prospect.html           ← my leads list
    /sales/prospect-add.html       ← add / edit lead
    /sales/prospect-detail.html    ← lead detail (5 tabs: Overview, Activities,
                                      To-Do, Transactions, Map)
    /sales/prospect-bulk.html      ← bulk upload wizard (3 steps)
    /sales/activities.html         ← calendar + schedule view
    /sales/products.html           ← product catalog (read-only)
    /sales/profile.html
    /sales/change-password.html
    /sales/notifications.html
    /sales/search.html             ← global search (sales-scoped)

  ── ROLE: SUPERVISOR ──────────────────────────────────────────
    /supervisor/index.html         ← team dashboard (team KPIs + charts)
    /supervisor/team.html          ← sales management list
    /supervisor/team-detail.html   ← individual sales detail (4 tabs:
                                      Leads, To-Dos, Activities, Schedule)
    /supervisor/todo-monitor.html  ← to-do monitor across all managed sales
    /supervisor/schedule.html      ← schedule monitor (read-only calendar)
    /supervisor/map.html           ← lead map view (team pins)
    /supervisor/reports.html       ← performance + lead + activity + transaction
    /supervisor/announcements.html
    /supervisor/profile.html
    /supervisor/change-password.html
    /supervisor/notifications.html
    /supervisor/search.html        ← global search (team-scoped)

  ── ROLE: DIRECTOR ────────────────────────────────────────────
    /director/index.html           ← executive dashboard (10 charts)
    /director/reports.html         ← all report types + GPS + PDF export
    /director/users.html           ← user management (full)
    /director/announcements.html   ← create + manage announcements
    /director/profile.html
    /director/change-password.html
    /director/notifications.html
    /director/search.html          ← global search (all data)

    Master Data:
    /director/master/product-category.html
    /director/master/product.html
    /director/master/lead-source.html
    /director/master/lead-status.html
    /director/master/activity-type.html
    /director/master/industry.html
    /director/master/region.html
    /director/master/unit.html

    Settings:
    /director/settings/general.html        ← company info
    /director/settings/targets.html        ← monthly targets per sales
    /director/settings/gps.html            ← GPS radius thresholds
    /director/settings/notifications.html  ← notification toggles
    /director/settings/working-days.html   ← weekdays + public holidays
    /director/settings/backup.html         ← export / restore / reset

  ── ROLE: ADMIN ───────────────────────────────────────────────
    /admin/index.html              ← admin landing (User Management)
    /admin/users.html              ← user management (full)
    /admin/audit-log.html          ← audit trail (read-only)
    /admin/announcements.html      ← create + manage announcements
    /admin/profile.html
    /admin/change-password.html
    /admin/notifications.html
    /admin/search.html             ← global search (users + master data)

    Master Data:
    /admin/master/product-category.html
    /admin/master/product.html
    /admin/master/lead-source.html
    /admin/master/lead-status.html
    /admin/master/activity-type.html
    /admin/master/industry.html
    /admin/master/region.html
    /admin/master/unit.html

    Settings:
    /admin/settings/general.html
    /admin/settings/gps.html
    /admin/settings/notifications.html
    /admin/settings/working-days.html
    /admin/settings/backup.html    ← export / restore / reset

PAGE COUNT SUMMARY:
  Auth / System   :  7 pages
  Sales           : 11 pages
  Supervisor      : 12 pages
  Director        : 22 pages  (8 master + 6 settings + 8 core)
  Admin           : 21 pages  (8 master + 5 settings + 8 core)
  JS Utilities    :  3 files
  ─────────────────────────────
  TOTAL HTML      : 73 pages

All pages share a common sidebar + topbar layout (via /js/layout.js inject).
Role-based rendering: sidebar items and page guards enforced per session role.
Session stored in localStorage.

===========================================================================================
## 1. AUTHENTICATION & SESSION MANAGEMENT
===========================================================================================

### 1.1 Login Page
- Email + password fields
- Show/hide password toggle
- "Remember Me" checkbox — persist session across browser close
- Input validation: empty fields, invalid email format
- Error state: "Invalid email or password" (mock check against seeded users)
- Rate limit mock: after 5 failed attempts, lock form for 30 seconds + show countdown
- Redirect to role-appropriate dashboard on success
- Link to Forgot Password

### 1.2 Forgot Password Page
- Email input with validation
- Submit → mock: show success banner "If this email is registered, a reset link has been sent"
- (Do not confirm whether email exists — security best practice message)

### 1.3 Reset Password Page
- New password + confirm password fields
- Password strength meter (Weak / Fair / Strong / Very Strong)
  - Rules: min 8 chars, uppercase, lowercase, number, special character
- Show/hide toggles on both fields
- Error if passwords don't match
- On success → redirect to login with success toast

### 1.4 First-Time Login / Force Password Change
- Triggered when user.mustChangePassword = true (set by Admin on user creation)
- Page: /first-time-setup.html
  - Welcome message with user's name
  - Force-change password form (same rules as reset)
  - Cannot skip or navigate away until completed
  - On submit → update session, redirect to dashboard

### 1.5 Logout
- Available from topbar user dropdown
- Confirmation modal: "Are you sure you want to logout?"
- On confirm: clear session from localStorage, redirect to /login.html
- Expired/invalid session on any page → auto redirect to login with query param ?reason=session_expired
  → login page shows banner: "Your session has expired. Please log in again."

### 1.6 Session Guard
- Every page on load checks localStorage for valid session
- No session → redirect to /login.html
- Session role not permitted for page → redirect to /403.html
- Inactive user account → force logout

### 1.7 403 Unauthorized Page
- Message: "You don't have permission to access this page"
- Shows current user role
- Button: Go to My Dashboard

### 1.8 404 Not Found Page
- Message with back button and home link

===========================================================================================
## 2. GLOBAL LAYOUT & NAVIGATION
===========================================================================================

### 2.1 Sidebar Navigation (role-aware, collapsible)
- Logo + system name at top
- Collapse to icon-only mode (toggle button)
- Active state highlight on current page
- Role-based menu items:

  SALES:
    Dashboard | My Leads | Activities (Calendar) | Products | Help

  SUPERVISOR:
    Dashboard | Sales Management | Lead Monitor | To-Do Monitor |
    Schedule Monitor | Reports | Announcements | Help

  DIRECTOR:
    Executive Dashboard | Reports | User Management |
    Master Data (expandable) | Announcements | Settings | Help

  ADMIN:
    User Management | Master Data (expandable) | System Settings |
    Audit Log | Announcements | Backup & Restore | Help

### 2.2 Topbar
- Hamburger menu to toggle sidebar collapse (mobile)
- Breadcrumb trail (e.g. Home > Leads > Lead Detail > Activity)
- Global search bar — search across leads, products, users (role-filtered)
  - Live dropdown preview (top 5 results with type label)
  - Enter → /search.html with full paginated results
- Notification bell (badge with unread count)
  - Dropdown: last 10 notifications, type icon, message, timestamp, unread highlight
  - "Mark all as read" link
  - "View all notifications" link → /notifications.html
- User avatar + name
  - Dropdown: View Profile | Change Password | Help | Logout

### 2.3 Notifications Full Page (/notifications.html)
- Full paginated list of all notifications
- Filter by: type, read/unread, date
- Bulk mark as read
- Delete notification (individual + clear all read)
- Click → navigate to relevant record

### 2.4 Global Search (/search.html)
- Search input with result sections: Leads, Products, Users, Activities
- Each section shows top 5 with "View all in [module]" link
- Result cards show key fields + status badge
- Empty state per section if no results

===========================================================================================
## 3. PROFILE MANAGEMENT (All Roles)
===========================================================================================

### 3.1 View Profile (/profile.html)
- Profile photo (circle avatar, click to change)
- Full Name, Email (read-only), Phone, Role (read-only), Region (read-only)
- Assigned Supervisor (Sales only, read-only)
- Member since date, Last login timestamp
- Edit Profile button

### 3.2 Edit Profile
- Editable: Full Name, Phone, Profile Photo (mock: choose from preset avatars OR upload)
- Email and Role are locked (Admin-only to change)
- Save with validation

### 3.3 Change Password (/change-password.html)
- Current password field (with show/hide)
- New password + confirm password (with show/hide)
- Password strength meter
- Validation: current password must match stored, new ≠ current, passwords must match
- On success: toast + redirect back to profile

### 3.4 My Activity Summary (on Profile page, Sales only)
- Mini stats: Total Leads This Month, Total Visits, Closings, Target %
- Quick links to My Leads, My To-Dos

===========================================================================================
## 4. MASTER DATA (Admin & Director access — full CRUD)
===========================================================================================

All master data pages follow a consistent pattern:
- Page header: title + Add button
- Searchable, sortable, paginated table
- Columns always include: Name, Status (Active/Inactive), Created At, Actions (Edit/Toggle)
- Add/Edit via modal form with validation
- Cannot delete records that are in use — show warning
- Deactivated records are excluded from all dropdown options throughout the system
- Changes to master data are logged in Audit Log

### 4.1 Product Category
- Fields: Category Name*, Description, Status
- Used in: Product master, lead activity filters, reports

### 4.2 Product Master
- Fields: Product Name*, SKU* (auto-suggest or manual), Category* (from 4.1),
  Unit* (from 4.8), Price* (number, currency), Description, Image (mock upload), Status
- Unique constraint: SKU must be unique
- Filter by: Category, Status
- Sales: read-only view of active products only

### 4.3 Lead Source
- Fields: Source Name* (Walk-in, Referral, Social Media, Cold Call, Event, Website,
  Exhibition, Partnership, Other), Description, Icon (select from preset set), Status

### 4.4 Lead Status
- Fields: Status Name*, Color Code* (hex color picker), Display Order*, 
  Is Final Status (toggle — Dead/Converted type), Description, Status
- Pre-seeded: Hot (red), Warm (orange), Cold (blue), Dead (gray), Converted (green)
- Display Order controls the funnel sequence in charts
- Cannot deactivate status currently used by leads

### 4.5 Activity Type
- Fields: Activity Type Name* (Call, Visit, WhatsApp, Email, Meeting, Demo, Presentation),
  Requires GPS Verification (toggle — only Visit-type should be yes), 
  Icon (select from preset), Description, Status

### 4.6 Industry
- Fields: Industry Name* (Manufacturing, Retail, Healthcare, Education, Finance,
  Technology, Hospitality, Construction, Agriculture, Other), Description, Status
- Used in: Corporate lead type

### 4.7 Region / Area
- Fields: Region Name*, Province*, City/Kabupaten*, Status
- Assigned to Sales users for territory management
- Filter leads and reports by region

### 4.8 Unit of Measure
- Fields: Unit Name* (pcs, box, kg, liter, unit, set, pack, carton, meter), 
  Abbreviation*, Status
- Used in: Product master and transaction records

### 4.9 Announcement Category (for Announcements module)
- Fields: Category Name* (General, Policy, Sales Update, System, Urgent), 
  Color, Status

===========================================================================================
## 5. USER MANAGEMENT (Admin & Director)
===========================================================================================

### 5.1 User List
- Table: Avatar, Full Name, Email, Role badge, Region(s), Status badge, 
  Last Login, Supervisor (Sales only), Actions
- Filter: Role, Region, Status
- Search: name, email
- Pagination: 10/25/50 per page

### 5.2 Add User (Modal or dedicated page)
- Fields: Full Name*, Email*, Temporary Password (auto-generate or manual)*,
  Role* (Sales / Supervisor / Director / Admin), 
  Region Assignment* (multi-select, from Region master, required for Sales & Supervisor),
  Phone, Profile Photo (mock), Status (Active/Inactive)
- Force Change Password on first login: toggle (default ON)
- On save: user.mustChangePassword = true if toggled
- Email shown once in success modal "Save this temporary password: XXXX"

### 5.3 Edit User
- Same fields as Add except password (use separate Reset Password action)
- Cannot edit own Role
- Cannot deactivate own account

### 5.4 Supervisor–Sales Assignment
- Dedicated section in User Management or in Sales user edit form
- "Assign Supervisor" dropdown: shows only active Supervisor users
- A Sales can have only one Supervisor
- Supervisor can only see Sales assigned to them

### 5.5 Deactivate / Reactivate User
- Confirmation modal with reason input
- Deactivated users: cannot login, session immediately invalidated
- Their data (leads, activities, transactions) remains fully intact and visible

### 5.6 Reset Password (Admin action)
- Admin clicks "Reset Password" on any user
- Modal: set new temporary password (or auto-generate)
- On confirm: set user.mustChangePassword = true
- Show temporary password once in modal with copy button

### 5.7 View User Detail
- All user info
- Sales: list of their assigned leads (count + quick view), their supervisor
- Activity summary (for Sales: leads, closings, last active)

===========================================================================================
## 6. ROLE 1 — SALES
===========================================================================================

### 6.1 Dashboard (/dashboard.html)
- Greeting: "Good morning, [Name] 👋 Today is [Day, Date]"
- Monthly target progress card (progress bar + % label + closings/target count)
- KPI summary cards (2 rows):
  Row 1: Total My Leads | Hot | Warm | Cold | Dead | Converted
  Row 2: Visits This Month | Closings This Month | Est. Total Value | Overdue To-Dos
- Charts (2-column grid):
  - Lead Status Distribution — donut
  - Monthly Closings Trend (last 6 months) — line
  - Visit Frequency This Month by Week — bar
  - Lead Source Breakdown — horizontal bar
- Recent Activities feed: last 5 follow-ups with lead name, type, date
- Upcoming Agenda: next 3 to-dos by due date
- Overdue To-Do warning banner (if any exist): "You have X overdue tasks" + link

### 6.2 My Leads — List (/leads/index.html)
- Page header: "My Leads" + Add Lead button + Bulk Upload button
- View toggle: Table view | Card view
- Table columns: #, Lead Name/Company, Type badge, Status badge, Source, 
  Est. Value, Last Activity, Next Agenda Date, Actions (View/Edit)
- Filters panel (collapsible): Status, Type, Source, Region, Date Added range
- Sort: Name, Date Added, Est. Value, Last Activity
- Search: name, company, phone, email
- Pagination: 10/25/50 per page
- Lead age indicator: colored dot (Green <7d, Yellow 7-30d, Orange 30-90d, Red >90d 
  since last activity)
- Duplicate detection: when adding/editing, if same phone or email exists, 
  show warning banner "A lead with this phone/email already exists: [Name]"

### 6.3 Bulk Upload (/leads/bulk-upload.html)
- Step-by-step wizard (3 steps):
  Step 1: Download Template
    - Download button → generate .xlsx template via SheetJS
    - Template has two sheets: Individual, Corporate
    - Each sheet has header row with column descriptions in row 2
  Step 2: Upload & Validate
    - Drag-and-drop or click-to-upload .xlsx
    - Parse with SheetJS
    - Preview table with row-by-row validation:
      - Green row: valid
      - Yellow row: warning (missing optional field)
      - Red row: error (missing required / invalid format / duplicate)
    - Summary: X valid, Y warnings, Z errors
    - Cannot proceed if any red rows exist
  Step 3: Confirm & Import
    - Final count confirmation
    - Import button → save to localStorage → success page with count

### 6.4 Add / Edit Lead (/leads/add.html or modal)
  Lead Type toggle: [ Individual ] [ Corporate ]

  INDIVIDUAL:
  - Full Name*, Phone*, Email, ID Number (KTP), Date of Birth (date picker),
    Gender (dropdown), Occupation, Address*, City*, Region* (from master),
    Postal Code, Notes

  CORPORATE:
  - Company Name*, Industry* (from master), PIC Name*, PIC Position, PIC Phone*,
    PIC Email, NPWP/Tax ID, Company Address*, City*, Region* (from master),
    Postal Code, Company Size (1–10 / 11–50 / 51–200 / 200+), Website, Notes

  COMMON FIELDS:
  - Lead Source* (from master)
  - Estimated Deal Value* (number, Rp currency format)
  - Lead Status* (from master, default: Warm)
  - Coordinate: text input (lat, lng) + "Pick on Map" button
    - Leaflet modal: click on map to drop pin, confirm to save coordinates
    - "Use My Current Location" button in map modal
  - Assigned Sales: auto-fill current user (Admin/Supervisor can change)

  Form validation:
  - Required field highlights on submit
  - Phone format validation
  - Email format validation
  - Duplicate check on phone/email on blur

### 6.5 Lead Detail (/leads/detail.html)
- Sticky header: Lead Name/Company, Status badge (click to change), 
  Type badge, Assigned Sales, Edit Lead button
- Quick stats bar: Total Activities | Total Visits | Total Transactions | Total Value Transacted

  TAB 1: OVERVIEW
  - Full lead information card (all fields, well formatted)
  - Lead Source badge, Region badge
  - Coordinate display with mini Leaflet map preview (150px tall)
  - "Edit Lead" button

  TAB 2: ACTIVITIES
  - Timeline UI: chronological list, newest first
  - Each entry: date+time, activity type icon+label, platform, outcome/notes, 
    next agenda, GPS status badge (if visit), logged by
  - Add Follow-Up button → modal:
    - Date & Time* (default now)
    - Activity Type* (from master)
    - Platform (WhatsApp, Phone, Zoom, Google Meet, In-Person, Email, etc.)
    - Outcome / Notes* (textarea)
    - Next Agenda (text)
    - Next Agenda Date (date picker)
    - If activity type has "Requires GPS Verification = true":
      → Trigger GPS Verification step (cannot skip):
        → "Verify My Location" button → calls navigator.geolocation
        → Loading state while fetching GPS
        → Show: My Coords, Lead Coords, Distance, Verification Status
          (✅ Verified ≤200m / ⚠️ Nearby 200–500m / ❌ Out of Range >500m)
          [200m is default, configurable in Settings]
        → GPS result saved with activity log regardless of outcome
        → Out of Range does NOT block submission but shows warning
    - Attach file (mock — store filename only)
    - Save → append to timeline, update "Last Activity" date on lead

  TAB 3: TO-DO
  - Kanban-style or list view: Pending | Done | Overdue
  - Each card: Title, Due Date, Priority badge, Notes, Status, Edit/Done/Delete actions
  - Add To-Do modal:
    - Title* (text)
    - Due Date* (date picker)
    - Priority* (Low / Medium / High)
    - Notes (textarea)
    - Reminder (toggle): remind X days before due date (creates notification)
  - Mark as Done button → confirmation → moves to Done column
  - Overdue: auto-computed (due date < today + status Pending) → highlighted red
  - Visible to Supervisor and Director (read-only for them)

  TAB 4: TRANSACTIONS
  - Summary: Total Transactions | Total Products Purchased | Total Value
  - Products Summary card: aggregated table of all products ever bought 
    (product name, total qty, total value, last purchase date)
  - Transaction History table: Date, Order Ref, Products (chip list), Total Value, Notes
  - Mark Transaction button → modal:
    - Transaction Date* (date picker, default today)
    - Order Reference (optional text)
    - Product rows (add/remove):
      - Product* (searchable dropdown from active products)
      - Qty* (number)
      - Unit (auto-filled from product)
      - Unit Price (auto-filled, editable)
      - Subtotal (auto-calculated, read-only)
    - Total Value (sum of all rows, read-only)
    - Notes
    - After save: prompt "Update lead status to Converted?" (Yes/No)

  TAB 5: MAP
  - Full-width Leaflet map
  - Lead location pin (blue, labeled)
  - Visit check-in history pins (green = verified, orange = nearby, red = out of range)
  - Click pin → popup with activity date, distance, GPS status

### 6.6 Activities — Calendar View (/activities.html)
- Monthly calendar showing:
  - Activity logs (colored by activity type)
  - To-Do due dates (with priority color)
  - Upcoming agendas from follow-up logs
- Toggle: Monthly | Weekly | List view
- Click day → slide-in panel with all items for that day
- Click item → navigate to Lead Detail > relevant tab
- Filter: show Activities / To-Dos / Agendas (toggle each)

### 6.7 Products (/products.html) — Read-only for Sales
- Grid/list of active products
- Search by name, SKU
- Filter by category
- Product card: image placeholder, name, SKU, category, price, description
- Click → product detail modal

### 6.8 Help (/help.html) — All Roles
- FAQ accordion (basic: how to add lead, how GPS works, how to bulk upload, etc.)
- Quick reference: Lead Status meanings, Activity Type descriptions
- Contact Support mock form (Name, Email, Message, Submit → success toast)
- Version info: "CRM System v1.0 — Prototype"

===========================================================================================
## 7. ROLE 2 — SUPERVISOR / MANAGER
===========================================================================================

### 7.1 Dashboard
- "Managing X Sales Reps in [Region(s)]"
- Team KPI cards: Total Team Leads | Team Hot Leads | Team Closings This Month |
  Team Est. Revenue | Overdue To-Dos (team-wide) | GPS Out-of-Range Count This Month
- Charts:
  - Per-Sales performance (grouped bar: leads added vs closings)
  - Team lead status breakdown (stacked bar per sales rep)
  - Team activity count this month (bar per sales rep)
  - Lead funnel overview (horizontal stacked bar by status)
- Overdue To-Do alert panel: count + top 3 overdue tasks + "View All" link
- Team upcoming agendas today (list)

### 7.2 Sales Management
- List of Sales assigned to this Supervisor
  - Columns: Name, Region, Total Leads, Active Leads, Closings MTD, Last Active
  - Click row → Sales Detail page
- Sales Detail:
  - Profile info summary (read-only)
  - Performance mini cards (their leads, visits, closings this month, target %)
  - Tabs: Leads | To-Dos | Activities | Schedule
  - Leads tab: full lead list (read-only, all filters)
    - Click lead → Lead Detail (all tabs, read-only)
  - To-Dos tab: all to-dos for this sales
  - Activities tab: all activity logs for this sales (filterable)
  - Schedule tab: their calendar view (read-only)

### 7.3 To-Do Monitor
- Table of all To-Dos across all managed Sales
- Columns: Sales, Lead Name, Task Title, Due Date, Priority badge, Status badge, 
  Days Overdue (computed), Last Reminded, Actions
- Filter: Sales, Status, Priority, Date Range
- Sort: Due Date, Priority, Status
- "Send Reminder" button (per overdue row):
  - Confirmation: "Send reminder to [Sales Name] for task '[Title]'?"
  - Mock: creates SUPERVISOR_REMINDER notification for that Sales user
  - Updates "Last Reminded" timestamp in row
  - Toast: "Reminder sent to [Name]"
- Bulk remind: checkbox select + "Send Reminder to Selected"

### 7.4 Schedule Monitor
- Supervisor's view of all managed Sales' calendars
- Toggle: view one Sales or overlay all
- Read-only calendar with filter by Sales

### 7.5 Lead Map View
- Leaflet map: all leads from managed Sales, color-coded pins by status
- Filter: Status, Sales Rep, Region
- Popup on pin: Lead Name, Status, Sales Rep, Last Activity Date, Est. Value
- Layer toggle: show/hide GPS Check-in History pins

### 7.6 Reports (Supervisor scope)
- Filter: Sales Rep (multi-select, own team only), Date Range, Region
- Tabs:
  - Performance Report: per-sales table (leads added, visits, closings, est. value,
    conversion rate, target %, GPS verifications)
  - Lead Report: full filterable lead list
  - Activity Report: all activities log
  - Transaction Report: all transactions
- Export tab data → .xlsx (SheetJS)
- Print view (CSS @media print friendly)

### 7.7 Announcements (/announcements.html)
- View announcements sent to their role/team
- Mark as read

### 7.8 Profile
- Same as Sales (section 6.3 profile features)

===========================================================================================
## 8. ROLE 3 — DIRECTOR
===========================================================================================

### 8.1 Executive Dashboard
- Date range filter (This Month / Last 3 Months / Last 6 Months / This Year / Custom)
- Global KPI cards (2 rows):
  Row 1: Total Active Leads | Total Converted Leads | Closings MTD | Est. Revenue MTD
  Row 2: Total Sales Reps | Active Products | GPS Violations MTD | Overdue To-Dos (all)
- Charts (3-column grid, responsive):
  - Revenue Trend (12 months) — line
  - Sales Rep Performance (closings + est. value) — grouped bar
  - Lead Funnel by Status — horizontal stacked bar / funnel
  - Lead Source Distribution — donut
  - Top 10 Products by Qty — horizontal bar
  - Top 10 Products by Revenue — horizontal bar
  - New vs Closed Leads per Month — grouped bar
  - Conversion Rate by Region — bar
  - Lead Type Breakdown (Individual vs Corporate) — donut
  - Activity Type Frequency — bar
- Filter all charts by: Region, Sales Rep, Product Category

### 8.2 Reports (Global scope)
- All report types, unfiltered by team
- Additional report: GPS Verification Report 
  (sales, lead, date, activity, distance, result)
- All exports: .xlsx + PDF (jsPDF)
- Print-friendly layout

### 8.3 User Management
- Full access (same as section 5)

### 8.4 Master Data
- Full access (same as section 4)

### 8.5 Announcements (Create & Manage)
- Create announcement:
  - Title*, Body* (rich text via textarea), Category* (from 4.9),
    Target Roles (checkboxes: Sales / Supervisor / Director / All),
    Priority (Normal / Important / Urgent), Publish Date (now or scheduled),
    Expiry Date (optional)
- Announcement list: Title, Category, Target, Status (Draft/Published/Expired),
  Published At, Read Count (mock)
- Edit, Delete (with confirmation), Unpublish

### 8.6 System Settings (/settings/)
  /settings/general.html — Company Info
    - Company Name, Logo (mock upload), Tagline, Address, Phone, Email, Website
    - Default Currency (Rp), Date Format, Timezone (display only)
    - Save → applies company name/logo to sidebar and login page

  /settings/targets.html — Monthly Targets
    - Table: Sales Name, Current Month Target (closings), Revenue Target (Rp)
    - Inline edit or modal per row
    - Bulk set: set same target for all sales
    - Shows actual vs target for current month

  /settings/gps.html — GPS Settings
    - GPS Verification Radius (meters): number input (default 200)
    - Verified threshold (≤ X meters)
    - Nearby threshold (X to Y meters)
    - Out of Range (> Y meters)
    - Live preview: "Within 200m = Verified, 200–500m = Nearby, >500m = Out of Range"
    - GPS Required activity types: list of activity types with GPS toggle (syncs with master)

  /settings/notifications.html — Notification Settings
    - Toggle on/off per notification type:
      - Overdue To-Do alert (to Sales + Supervisor)
      - GPS Out-of-Range alert (to Supervisor + Director)
      - Lead assignment notification (to Sales)
      - Supervisor reminder sent (to Sales)
      - New announcement (to target role)
    - Global notification toggle (disable all)

  /settings/working-days.html — Working Days
    - Weekday toggles (Mon–Sun, default Mon–Sat)
    - Public holidays list: Add/Edit/Delete entries (Date, Name)
    - Working days used for overdue calculation (to-dos due on holiday 
      roll to next working day)

  /settings/backup.html — Backup & Restore (Admin + Director)
    - Export All Data: button → generate JSON blob of all localStorage data → download as .json
    - Import / Restore: upload .json file → preview summary (X leads, X users, etc.) 
      → confirm to restore (overwrites current localStorage)
    - Reset to Demo Data: button → confirmation modal → re-seed all mock data (wipes custom data)
    - Last backup timestamp display

===========================================================================================
## 9. ROLE 4 — ADMIN (System Administrator)
===========================================================================================

- Access: User Management (full), Master Data (full), 
  System Settings (full), Audit Log, Announcements (full), Backup & Restore
- Cannot access: Lead data, Activity data, Sales Performance, Director charts

### 9.1 Audit Log (/audit-log.html)
- Auto-logged actions: Login, Logout, Add/Edit/Delete Lead, Add Activity, 
  Mark Transaction, Add/Edit/Delete User, Master Data changes, 
  Settings changes, Bulk Upload, Export, Backup/Restore, Password Reset
- Table: Timestamp, User (name + role), Action, Module, Record ID/Name, 
  Details (brief description), IP (mock: "192.168.1.X")
- Filter: Date Range, User, Role, Action Type, Module
- Sort: Timestamp desc (default)
- Pagination: 25/50/100 per page
- Export Audit Log → .xlsx
- Read-only — no delete, no edit

===========================================================================================
## 10. ANNOUNCEMENTS (All Roles — view)
===========================================================================================

- /announcements.html — inbox-style list
- Show only announcements targeted to current user's role, within publish/expiry dates
- List: Category badge, Title, Priority badge, Date, Read/Unread dot
- Click → detail modal: full body, category, date
- Mark as read (auto on open)
- Unread count badge on sidebar menu item
- Urgent announcements: auto-show as modal on dashboard load (once per session)

===========================================================================================
## 11. NOTIFICATION SYSTEM
===========================================================================================

- All notifications stored in localStorage per user ID
- Fields per notification: id, userId, type, title, message, link (target page+params),
  isRead, createdAt
- Types and triggers:
  - OVERDUE_TODO: checked on page load — any to-do with due date < today + status Pending
    → creates notification for owner Sales + their Supervisor (if not already notified today)
  - SUPERVISOR_REMINDER: created when Supervisor clicks "Send Reminder"
    → notification for target Sales user
  - GPS_OUT_OF_RANGE: created when a visit activity is logged with Out of Range result
    → notification for that Sales' Supervisor
  - LEAD_ASSIGNED: when Admin/Supervisor changes assigned Sales on a lead
    → notification for the newly assigned Sales
  - ANNOUNCEMENT: when new announcement published targeting this role
    → notification for all users of that role
- Topbar bell: unread badge, dropdown last 10, "View All" link
- Click notification → navigate to target page (link field)
- Mark single as read on click
- Mark all as read button

===========================================================================================
## 12. REPORTS & EXPORTS
===========================================================================================

All reports support:
- Date range filter
- Role-based scope (Sales sees own data, Supervisor sees team, Director sees all)
- Table view with pagination
- Export to .xlsx via SheetJS
- Export to PDF via jsPDF (tabular layout)
- Print button (opens CSS @media print optimized view)
- Column visibility toggle (show/hide columns before export)

Report Types:
1. Lead Report: all lead fields + status + last activity + transaction count
2. Activity Report: all activities with GPS status, sales, lead, date, type, outcome
3. Transaction Report: all transactions with products, qty, value, sales, lead, date
4. Performance Report: per-sales summary (leads, visits, closings, value, conversion, target %)
5. GPS Verification Report: visit activities with distance and verification results
6. To-Do Report: all to-dos with status, overdue days, assigned sales, lead
7. Product Performance Report: products sorted by qty sold and by revenue

===========================================================================================
## 13. GENERAL UI/UX STANDARDS
===========================================================================================

Design system:
- Font: Inter (Google Fonts CDN)
- Primary: #2563EB (blue-600)
- Sidebar: #1E293B (slate-800)
- Success: #16A34A | Warning: #D97706 | Danger: #DC2626 | Info: #0891B2
- Background: #F8FAFC (slate-50)
- Card background: white, rounded-xl, shadow-sm
- Border: #E2E8F0

Components (used consistently across all pages):
- Page layout: sidebar (w-64 collapsed: w-16) + main area with topbar
- Page header: H1 title + breadcrumb (left), primary action button (right)
- Data table: thead (sticky on scroll), striped rows, hover highlight, 
  sort arrow icons, action column fixed right, responsive (horizontal scroll on mobile)
- Pagination: First | Prev | [1 2 3 ...] | Next | Last + "Showing X–Y of Z results"
- Modal: centered, backdrop, header + body + footer, close on backdrop click or X,
  cannot close during loading state
- Forms: labeled inputs (not placeholder-only), required asterisk, 
  inline error below field, disabled state styling
- Badges/pills: rounded-full, color-coded, consistent sizes (sm and xs variants)
- Toast notifications: fixed top-right, slide-in animation, auto-dismiss 3s, 
  manual close X, stacks up to 3 (oldest dismissed first)
  Types: Success (green), Error (red), Warning (amber), Info (blue)
- Confirmation modal: title + description + Cancel (outline) + Confirm (destructive/primary)
- Empty state: centered illustration (SVG icon) + heading + sub-message + optional CTA
- Loading skeleton: shimmer gray bars matching layout shape (cards, table rows)
- Loading spinner: overlay with centered spinner for full-page loads
- Tooltip: on hover for icon-only buttons (delay 300ms)
- Tabs: underline style, active indicator, keyboard accessible
- Accordion: smooth expand/collapse for FAQ and filter panels
- Drag-and-drop upload zone: dashed border, hover highlight, file type + size display

Responsive breakpoints:
- Desktop (≥1280px): full sidebar, multi-column grid, full table
- Tablet (768–1279px): collapsed sidebar (icon-only default), 2-col grid
- Mobile (<768px): hidden sidebar (drawer), 1-col stacked, horizontal scroll tables

Chart standards (Chart.js):
- Consistent color palette across all charts
- Tooltips enabled (formatted values)
- Legends below chart
- Responsive: true
- Animations: subtle (300ms)
- No data state: show "No data available for selected period"

===========================================================================================
## 14. MOCK DATA SEEDING
===========================================================================================

Auto-seed on first load if localStorage is empty:

USERS (7):
- 1 Admin: admin@crm.com / Admin@123
- 1 Director: director@crm.com / Director@123
- 2 Supervisors: supervisor1@crm.com, supervisor2@crm.com / Supervisor@123
- 3 Sales: sales1@crm.com, sales2@crm.com, sales3@crm.com / Sales@123
- Sales1 + Sales2 → Supervisor1 | Sales3 → Supervisor2
- All users: mustChangePassword = false (for demo ease)

MASTER DATA:
- 5 Regions (Jakarta Selatan, Surabaya Timur, Bandung Kota, Medan, Bali)
- 4 Product Categories
- 10 Products (mix of categories, realistic names + prices in Rp)
- 6 Lead Sources, 5 Industries, 6 Activity Types, 3 Units
- Lead Statuses (pre-seeded: Hot, Warm, Cold, Dead, Converted)
- 3 Announcement Categories

LEADS (20 total, spread across sales1/2/3):
- Mix: 12 Individual, 8 Corporate
- Mix of all statuses
- Each has realistic Indonesian names, addresses, coordinates
- All have valid coordinates (real Indonesian cities)

ACTIVITIES:
- 3–5 activities per lead (mix of types, some with GPS data)
- Some GPS: Verified, some Out of Range (for demo)

TO-DOS:
- 2–4 per lead, mix of Pending / Done / Overdue
- Some overdue by 1–5 days (for notification demo)

TRANSACTIONS:
- 8 transactions across 8 different leads
- Each with 1–3 product rows, realistic quantities

NOTIFICATIONS:
- 15 pre-seeded (mix of types per user), 8 unread

AUDIT LOG:
- 30 mock entries spanning last 30 days

ANNOUNCEMENTS:
- 3 published (1 Urgent, 1 Important, 1 Normal) targeting different roles
- 1 expired

SETTINGS:
- Company Name: "PT Maju Bersama CRM"
- GPS Verified Radius: 200m | Nearby: 500m
- Monthly Targets: set per Sales (sales1: 5 closings, sales2: 4, sales3: 3)

===========================================================================================
## 15. TECHNICAL STACK & NOTES
===========================================================================================

- HTML5 + Tailwind CSS (Play CDN) + Vanilla JavaScript ES6+
- Chart.js (CDN) — all data visualizations
- SheetJS / xlsx.js (CDN) — Excel import and export
- Leaflet.js (CDN) + OpenStreetMap tiles — maps, coordinate picker
- jsPDF + jsPDF-AutoTable (CDN) — PDF export for reports
- Google Fonts (Inter) — via CDN link tag
- navigator.geolocation — GPS verification (browser API)
- localStorage — all data persistence (structured as namespaced keys: crm_users, 
  crm_leads, crm_activities, crm_transactions, crm_notifications, etc.)
- No frameworks, no build tools, no backend
- All pages work by simply opening in a browser (file:// or local server)
- Common JS utilities in /js/utils.js: formatCurrency, formatDate, 
  showToast, showModal, sessionGuard, seedData, etc.
- Common layout injected via /js/layout.js: renders sidebar + topbar based on session role
```