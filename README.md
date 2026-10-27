# Talent Path Solutions — Corporate Web Application & CRM

A premium, responsive, conversion-optimized corporate web application and administrative lead management system built for **Talent Path Solutions** (Education, Career Guidance, Flexible Learning, SSLC/PUC, and Recruitment Services).

---

## 1. Visual Identity & Design Direction

- **Brand Colors:**
  - Deep Navy: `#101B35` (Primary identity & dark backgrounds)
  - Navy Dark: `#0A1122` (Footer, microbars)
  - Electric Blue: `#3563F6` (Primary interactive accents & buttons)
  - Light Slate Background: `#F5F7FB`
  - Dark Charcoal Typography: `#182238`
- **Typography Pairing:**
  - Headings: `Manrope` (Geometric, confident, modern authority)
  - Body: `Inter` (High legibility, clean corporate editorial feel)
- **Design Principles:**
  - No generic templates or oversized empty blocks.
  - Subtle borders, layered ambient background gradients, and micro-interactions.
  - Verified claims, transparent academic requirements, and authentic student/employer tone.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS with custom brand design tokens (`src/index.css`, `tailwind.config.js`)
- **Icons:** Lucide React
- **Routing:** React Router v7 (`src/App.tsx`)
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Database & Auth:** Firebase Auth (Email/Password & Google OAuth) + Firebase Realtime Database & Cloud Firestore + resilient local storage
- **Analytics:** Google Analytics 4 tracking with privacy sanitization (no PII transmitted)
- **Communication Integrations:** WhatsApp official click-to-chat (`wa.me`), `tel:`, and `mailto:`

---

## 3. Project Architecture

```
d:/cilent/
├── public/
│   ├── favicon.svg             # Custom corporate SVG favicon
│   ├── robots.txt              # Search engine crawler policies
│   └── sitemap.xml             # Canonical XML sitemap
├── src/
│   ├── config/
│   │   └── company.ts          # Central client settings (Phone, WhatsApp, Emails, Address, GA4)
│   ├── data/
│   │   └── initialData.ts      # Verified initial programs, news articles & sample CRM leads
│   ├── lib/
│   │   ├── analytics.ts        # GA4 event tracking (form_start, click_whatsapp, click_call, etc.)
│   │   └── firebase.ts         # Firebase Auth, Realtime Database & Firestore configuration
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Enquiry, Program, NewsArticle, AdminUser)
│   ├── services/
│   │   ├── authService.ts      # Authentication, Google OAuth, session management
│   │   ├── enquiryService.ts   # Lead submission, real-time sync, status updates, CSV export
│   │   ├── programService.ts   # CRUD operations for courses & degree programs
│   │   └── newsService.ts      # CRUD operations for insights & announcements
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx      # Sticky header, programs dropdown, mobile drawer, top corporate bar
│   │   │   ├── Footer.tsx      # Verified details, legal links, staff portal shortcut
│   │   │   ├── FloatingWhatsApp.tsx # Floating widget with topic chips & click-to-call
│   │   │   ├── PublicLayout.tsx # Layout wrapper for public pages
│   │   │   └── SEOHead.tsx     # Dynamic meta title, description & GA4 page tracking
│   │   ├── forms/
│   │   │   ├── AdmissionEnquiryForm.tsx # 10-field form with honeypot & WhatsApp confirmation
│   │   │   ├── CareerGuidanceForm.tsx   # Specialized career goal form
│   │   │   ├── RecruitmentEnquiryForm.tsx # Employer staffing form
│   │   │   └── GeneralContactForm.tsx   # General communication form
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CompanyIntro.tsx
│   │   │   ├── ServicesGrid.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── FeaturedPrograms.tsx
│   │   │   ├── CareerGuidanceCTA.tsx
│   │   │   ├── NewsPreview.tsx
│   │   │   └── FinalCTA.tsx
│   │   └── admin/
│   │       └── AdminLayout.tsx # Protected sidebar layout & mobile drawer
│   └── pages/
│       ├── HomePage.tsx
│       ├── AboutPage.tsx
│       ├── CoursesPage.tsx
│       ├── CareerGuidancePage.tsx
│       ├── FlexibleLearningPage.tsx
│       ├── SslcPucPage.tsx
│       ├── RecruitmentPage.tsx
│       ├── NewsPage.tsx
│       ├── NewsDetailPage.tsx
│       ├── ContactPage.tsx
│       ├── PrivacyPolicyPage.tsx
│       ├── TermsPage.tsx
│       ├── NotFoundPage.tsx
│       └── admin/
│           ├── AdminLoginPage.tsx
│           ├── AdminDashboardPage.tsx
│           ├── AdminLeadsPage.tsx
│           ├── AdminProgramsPage.tsx
│           ├── AdminNewsPage.tsx
│           └── AdminSettingsPage.tsx
├── .env.example
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 4. Setup & Running Locally

### Step 1: Clone and Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: If you run without `.env`, the website automatically runs in high-fidelity mock persistence mode so all forms, lead pipelines, program additions, and the admin portal are 100% testable immediately!)*

### Step 3: Run the Development Server
```bash
npm run dev
```

### Step 4: Validate Production Build
```bash
npm run build
```

---

## 5. Administrative Portal Access (`/admin`)

The website includes a dedicated CRM and CMS system at `/admin`.

### Default Evaluation Credentials:
- **Email:** `admin@talentpathsolutions.com`
- **Password:** `TalentPath2025!`

### Admin Capabilities:
1. **Overview Dashboard:** Total leads, new leads, contacted, qualified, and converted metrics, service breakdown, recent activity.
2. **Leads Management:** Searchable and filterable table (by service and status), 1-click WhatsApp messaging to candidate, 1-click phone call, lead status changer, follow-up scheduler, internal counselor notes, and **Export to CSV**.
3. **Programs CMS:** Add, edit descriptions, adjust eligibility/duration/fees, and toggle publication status.
4. **News CMS:** Write and publish education articles with markdown-style paragraphs and category tags.
5. **Company Settings:** Manage centralized phone numbers, WhatsApp lines, office addresses, and Google Analytics tracking.

---

## 6. Database Setup Instructions (Supabase)

1. Create a project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste and run the contents of `supabase/migrations/20250101_initial_schema.sql`.
4. Copy your project URL and public `anon` key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Create an administrative user in **Authentication -> Users** using your team's real email and password.

---

## 7. WhatsApp Integration Guide

1. The website centralizes WhatsApp numbers in `src/config/company.ts`.
2. All click-to-chat links use the official international format:
   ```
   https://wa.me/[raw_number]?text=[encoded_message]
   ```
3. To update the company number, change `whatsapp.raw` in `src/config/company.ts` (e.g. `919876543210` without `+` or spaces).
4. After every form submission, candidates receive a direct 1-click "Connect via WhatsApp Now" button pre-filled with their Reference ID.

---

## 8. Google Analytics 4 Setup

1. Create a GA4 property in Google Analytics.
2. Under **Data Streams**, copy the **Measurement ID** (format: `G-XXXXXXXXXX`).
3. Set `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in `.env` or in `src/config/company.ts`.
4. Events tracked automatically:
   - `page_view`
   - `form_start`
   - `form_submit_success`
   - `click_whatsapp`
   - `click_call`
   - `click_email`
   - `view_program`
   - `click_career_guidance`
   - `click_recruitment_enquiry`
5. Strict PII stripping guarantees names, emails, and phone numbers are never transmitted to analytics.

---

## 9. Production Deployment

This project is optimized for deployment to Vercel, Netlify, or AWS Amplify.

### Deploying to Vercel:
1. Connect your repository to Vercel.
2. Set Build Command to `npm run build`.
3. Set Output Directory to `dist`.
4. Add environment variables from `.env`.
5. Deploy.
