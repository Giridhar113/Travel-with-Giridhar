# Travel with Giridhar

**Release:** Travel Website v1.5

A travel startup-style website built with HTML, CSS, and vanilla JavaScript. The experience helps users discover destinations, compare packages, estimate budgets, generate Claude-powered trip plans, save/share trip ideas, and send booking inquiries to a real Express/SQL backend with WhatsApp follow-up.

## v1.5 Goal

Make the website feel more product-ready with shareable planning, saved trip context, stronger filtering controls, and client-side lead capture.

## v1.5 Updates

- Added debounced destination search with focused travel-type filters
- Added live package price filtering with a reset action
- Added AI Trip Planner share links and local AI plan history
- Added wishlist drawer improvements with clear empty states and quick booking links
- Added testimonial submission with local preview and WhatsApp handoff
- Kept package and trip pricing INR-only for clearer local travel planning
- Added footer newsletter signup with client-side validation
- Added AI Planner skeleton loading state
- Fixed footer copyright rendering and cleaned encoding issues

Full release history is available in [`RELEASE_NOTES.md`](RELEASE_NOTES.md).

## Core Features

- AI-style trip planner
- Shareable trip plans
- Saved AI plan history
- Budget calculator
- Destination comparison
- Advanced destination search
- Travel category filters
- Trending destinations slider
- Customer review carousel
- Travel blog
- FAQ section
- WhatsApp floating button
- Better booking inquiry form
- Two-step form verification before booking/contact submissions
- Travel checklist saved in localStorage
- Newsletter signup saved in localStorage
- Testimonial submission demo flow
- INR-only package pricing
- Seasonal offers
- Package filters, sorting, wishlist, and comparison modal

## Pages

- `index.html` - Home page with hero slider, featured trips, AI planner, saved AI plans, budget estimator, seasonal offers, checklist, FAQ, and reviews
- `destinations.html` - Destination cards with search, filters, advanced search, comparison, best-time labels, and saved trips
- `packages.html` - Package cards with filters, sorting, wishlist, comparison, budget estimator, and package detail guide
- `blog.html` - Travel tips and planning guides
- `gallery.html` - Filterable masonry gallery with lightbox
- `about.html` - Company story, mission, reasons to choose us, and developer profile
- `contact.html` - 3-step booking form connected to the backend API, WhatsApp handoff, client-side feedback demo, and local testimonial form
- `admin/login.html` - Admin login for booking management
- `admin/dashboard.html` - Admin stats, Chart.js booking visuals, and recent bookings
- `admin/bookings.html` - Full booking table with lead status and WhatsApp lead management
- `404.html` - Branded not found page

## Backend + Admin Dashboard

Booking requests are stored through the Express/Postgres SQL backend in `server/`.

- Public booking endpoint: `POST /api/bookings`
- Admin login: `admin/login.html`
- Admin dashboard: `admin/dashboard.html`
- Admin bookings: `admin/bookings.html`
- Setup guide: [`SERVER_README.md`](SERVER_README.md)

Production booking flow now uses the same Vercel project API:

```txt
Website form -> /api/bookings -> SQL database -> WhatsApp handoff -> Admin dashboard
```

Add the backend environment variables in Vercel before using live booking/admin:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`
- `CORS_ORIGIN`
- `WHATSAPP_NUMBER`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

If SMTP is not configured, bookings still save and open WhatsApp; admin status emails are skipped safely.

## Claude Planner Setup

Add this Vercel environment variable for the AI Trip Planner:

- `ANTHROPIC_API_KEY`

The browser calls `/api/ai-planner`, and the serverless function calls Claude using `claude-sonnet-4-20250514`.

## Two-Step Verification

Booking submissions require a 6-digit confirmation code before the form is sent. This is a front-end verification layer; production SMS/email OTP would need a backend provider.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- localStorage
- Node.js + Express backend
- PostgreSQL/Neon SQL
- JWT admin auth
- WhatsApp booking handoff
- SMTP status email notifications
- Anthropic Claude API via Vercel serverless function

## Shared Site Config

Brand/contact values are centralized in `site-config.js`:

- Brand: `Travel with Giridhar`
- WhatsApp: `918179721034`
- GitHub: `https://github.com/Giridhar113/Travel-with-Giridhar`
- API base URL for booking submissions/admin dashboard
- Vercel deployment

## Shared Travel Data

Package, destination, budget-estimator, featured-trip, and trending-trip data are centralized in `data.js`. Update prices, durations, tags, images, and descriptions there first so homepage, destinations, packages, and booking dropdowns stay consistent.

## Developer

**Giridhar Reddy**
Frontend Developer skilled in HTML, CSS, and JavaScript.

- GitHub: https://github.com/Giridhar113/Travel-with-Giridhar
- Portfolio: https://giridhar-portfolio-ten.vercel.app/

## Live Link

https://travel-with-giridhar.vercel.app/
