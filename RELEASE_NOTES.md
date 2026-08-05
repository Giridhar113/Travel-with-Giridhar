# Travel with Giridhar Release Notes

## Travel Website v1.5

**Release goal:** Make the travel website feel more product-ready with better planning continuity, shareable trip ideas, stronger filters, and a clearer booking lead flow.

### New Features

- Added debounced destination search with focused chips for Beach, Adventure, Family, Luxury, and Culture.
- Added reset controls for destination and package filters.
- Added shareable AI Trip Planner links that restore the selected destination, budget, days, travelers, and travel type.
- Added local AI plan history with Open, Copy, Book, Remove, and Clear actions.
- Added testimonial submission on the Contact page with local preview and WhatsApp sharing.
- Kept package and trip pricing INR-only for clearer local travel planning.
- Added footer newsletter signup with client-side validation and local demo storage.
- Added AI Planner skeleton loading state while a plan is being generated.

### Improvements

- Improved wishlist drawer empty state and quick booking links.
- Improved package price range defaults so all packages are visible before filtering.
- Improved package and destination grids so filtered final rows use available space cleanly.
- Fixed footer copyright rendering across all pages.
- Cleaned encoding artifacts in title and review text.

### Result

v1.5 turns the project into a stronger interactive travel product demo with saved planning context, shareable plans, polished filters, cleaner UX states, and clearer release documentation.

---

## Travel Website v1.4

**Release goal:** Create a travel startup-style experience where users feel like they are planning a real trip and interacting with a travel business.

### New Features

- Added seasonal offers on the homepage with direct quote actions.
- Added a persistent travel checklist using localStorage.
- Added a homepage FAQ section to improve trust and reduce booking doubts.
- Added a destination comparison tool on the Destinations page.
- Added advanced destination search filters for budget and best season.
- Added package detail guide for stay options, route planning, and travel support.
- Added preferred contact method to the booking inquiry form.

### Improvements

- Improved package page messaging from EMI-first to quote-first travel planning.
- Improved booking form payload with phone, budget, travel type, and preferred contact method.
- Fixed AI Planner email lead capture to use the configured feedback template.
- Prepared the booking/contact form structure for real lead capture.
- Added a secure Claude planner API route for Vercel.
- Removed visible footer version labels for cleaner brand presentation.
- Updated WhatsApp and GitHub links.
- Added lazy loading and async decoding to static images.
- Improved page titles for stronger SEO and branding.

### Result

The site now feels more like a real travel startup experience with planning tools, business-style inquiry flow, trip comparison, trust-building content, and conversion-focused CTAs.

---

## Previous Interactive Release

**Release goal:** Make the travel website more modern, interactive, and functional.

### New Features

- Added EmailJS-ready booking and feedback form support.
- Added 3-step booking inquiry form.
- Added destination search and category filters.
- Added package search, sorting, price range filters, and result count.
- Added package comparison modal.
- Added wishlist/saved trips using localStorage.
- Added homepage budget estimator.
- Added trending destinations slider.
- Added featured trip filters.
- Added animated customer review carousel.
- Added upgraded gallery with filters and lightbox.
- Added mobile bottom navigation.
- Added sticky booking CTAs.

### Improvements

- Improved destination cards and package cards.
- Improved booking links with pre-filled package and destination details.
- Improved spacing, buttons, hover animations, and mobile responsiveness.
- Added footer version consistency across pages.
- Added clearer EmailJS error handling.

### Fixes

- Fixed booking form and feedback form separation.
- Fixed footer version mismatch.
- Fixed destination/package visibility issues from earlier work.
- Fixed inconsistent GitHub and portfolio links.

### Result

This release moved the project from a static frontend site into an interactive travel product prototype with search, filters, booking flow, wishlist, comparison, and review/gallery experiences.
