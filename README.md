# Travel with Giridhar

**Release:** Travel Website v1.4

A travel startup-style website built with HTML, CSS, and vanilla JavaScript. The experience helps users discover destinations, compare packages, estimate budgets, generate AI-style trip plans, save trips, and send booking inquiries through EmailJS.

## v1.4 Goal

Make the website feel like a real travel planning business, not only a portfolio page.

## v1.4 Updates

- Added seasonal offers on the homepage with direct quote CTAs
- Added a persistent travel checklist using localStorage
- Added a homepage FAQ section for trust and booking clarity
- Added destination comparison tool on the Destinations page
- Added advanced destination search controls for budget and best season
- Improved package page messaging from EMI-first to quote-first planning
- Added package detail guide for stay options, route planning, and travel support
- Improved booking inquiry data sent to EmailJS: phone, budget, travel type, and preferred contact method
- Fixed AI Planner email lead capture to use the configured feedback template instead of a removed message template
- Updated footer version to Travel Website v1.4
- Updated WhatsApp links to the active contact number

## Core Features

- AI-style trip planner
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
- Travel checklist saved in localStorage
- Seasonal offers
- Package filters, sorting, wishlist, and comparison modal

## Pages

- `index.html` - Home page with hero slider, featured trips, AI planner, budget estimator, seasonal offers, checklist, FAQ, and reviews
- `destinations.html` - Destination cards with search, filters, advanced search, comparison, best-time labels, and saved trips
- `packages.html` - Package cards with filters, sorting, wishlist, comparison, budget estimator, and package detail guide
- `blog.html` - Travel tips and planning guides
- `gallery.html` - Filterable masonry gallery with lightbox
- `about.html` - Company story, mission, reasons to choose us, and developer profile
- `contact.html` - 3-step booking form and EmailJS-ready feedback form
- `404.html` - Branded not found page

## EmailJS Template Parameters

Booking template:

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

Feedback / AI planner template:

- `from_name`
- `from_email`
- `customer_email`
- `to_email`
- `owner_email`
- `reply_to`
- `feedback_type`
- `feedback_rating`
- `message`

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- localStorage
- EmailJS
- Vercel deployment

## Developer

**Giridhar Reddy**
Frontend Developer skilled in HTML, CSS, and JavaScript.

- GitHub: https://github.com/Giridhar113/Travel-with-Giridhar
- Portfolio: https://giridhar-portfolio-ten.vercel.app/

## Live Link

https://travel-with-giridhar.vercel.app/
