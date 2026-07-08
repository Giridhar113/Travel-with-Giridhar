# Travel with Giridhar

**Release:** Travel Website v1.5

A travel startup-style website built with HTML, CSS, and vanilla JavaScript. The experience helps users discover destinations, compare packages, estimate budgets, generate Claude-powered trip plans, save/share trip ideas, and send booking inquiries through Formspree-ready forms.

## v1.5 Goal

Make the website feel more product-ready with shareable planning, saved trip context, stronger filtering controls, and client-side lead capture.

## v1.5 Updates

- Added debounced destination search with focused travel-type filters
- Added live package price filtering with a reset action
- Added AI Trip Planner share links and local AI plan history
- Added wishlist drawer improvements with clear empty states and quick booking links
- Added testimonial submission with local preview and WhatsApp handoff
- Added INR/USD currency toggle using a fixed static conversion rate
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
- INR/USD currency toggle
- Seasonal offers
- Package filters, sorting, wishlist, and comparison modal

## Pages

- `index.html` - Home page with hero slider, featured trips, AI planner, saved AI plans, budget estimator, seasonal offers, checklist, FAQ, and reviews
- `destinations.html` - Destination cards with search, filters, advanced search, comparison, best-time labels, and saved trips
- `packages.html` - Package cards with filters, sorting, wishlist, comparison, budget estimator, and package detail guide
- `blog.html` - Travel tips and planning guides
- `gallery.html` - Filterable masonry gallery with lightbox
- `about.html` - Company story, mission, reasons to choose us, and developer profile
- `contact.html` - 3-step booking form, Formspree-ready feedback form, and local testimonial form
- `404.html` - Branded not found page

## Formspree Fields

Replace the placeholders in `contact.html`:

- `https://formspree.io/f/YOUR_BOOKING_FORM_ID`
- `https://formspree.io/f/YOUR_CONTACT_FORM_ID`

Booking form fields:

- `from_name`
- `from_email`
- `customer_email`
- `to_email`
- `owner_email`
- `reply_to`
- `phone`
- `destination`
- `package_name`
- `travel_type`
- `approx_budget`
- `travel_date`
- `travelers`
- `travel_notes`
- `emi_needed`
- `preferred_contact`
- `travelers_type`

Contact form fields:

- `from_name`
- `from_email`
- `customer_email`
- `to_email`
- `owner_email`
- `reply_to`
- `feedback_type`
- `feedback_rating`
- `message`

## Claude Planner Setup

Add this Vercel environment variable for the AI Trip Planner:

- `ANTHROPIC_API_KEY`

The browser calls `/api/ai-planner`, and the serverless function calls Claude using `claude-sonnet-4-20250514`.

## Two-Step Verification

Booking and contact submissions now require a 6-digit confirmation code before the form is sent. This is a front-end verification layer for the static site; production SMS/email OTP would need a backend provider.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- localStorage
- Formspree
- Anthropic Claude API via Vercel serverless function

## Shared Site Config

Brand/contact values are centralized in `site-config.js`:

- Brand: `Travel with Giridhar`
- WhatsApp: `918179721034`
- GitHub: `https://github.com/Giridhar113/Travel-with-Giridhar`
- Vercel deployment

## Developer

**Giridhar Reddy**
Frontend Developer skilled in HTML, CSS, and JavaScript.

- GitHub: https://github.com/Giridhar113/Travel-with-Giridhar
- Portfolio: https://giridhar-portfolio-ten.vercel.app/

## Live Link

https://travel-with-giridhar.vercel.app/
