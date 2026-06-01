# Travel with Giridhar

**Release:** Travel Website v1.3

A product-style travel website built with HTML, CSS, and vanilla JavaScript. The project includes destination discovery, package filtering, booking inquiries, AI-style planning, wishlist persistence, reviews, gallery browsing, and mobile conversion CTAs.

## v1.3 Updates

- Integrated EmailJS-ready booking and contact form submissions with success/error toasts
- Rebuilt the booking request form as a 3-step progress stepper
- Added destination-based package filtering inside the booking form
- Added package search, category chips, price range controls, sorting, and live result count
- Added package comparison selection with a sticky compare bar and comparison modal
- Added global saved trips wishlist using localStorage
- Added wishlist button in the navbar with saved count and slide-in drawer
- Added homepage trip budget estimator with travelers, tier, duration, flights, insurance, breakdown, EMI estimate, and booking CTA
- Replaced static trending cards with a horizontal auto-scrolling trending destinations slider
- Rebuilt featured trips with homepage filter chips
- Upgraded testimonials into an auto-rotating carousel with avatars, trip names, ratings, and verified traveler labels
- Upgraded gallery with category filters, masonry layout, lazy-loaded images, and lightbox controls
- Added AI Planner lead actions: email this plan and WhatsApp this plan
- Added desktop sticky booking CTA and mobile Call / WhatsApp / Book Now CTA bar
- Added mobile bottom navigation across all pages
- Standardized footer version to Travel Website v1.3

## Earlier Highlights

- 50 destinations and 50 travel packages
- Destination search and filter chips
- No destinations found empty state
- Hero slider and AI-style trip planner
- Package booking links prefill destination/package details
- Blog, gallery, about, contact, and branded 404 pages
- Dark/light theme toggle, back-to-top button, smooth animations, and responsive layout

## Pages

- `index.html` - Home page with hero slider, featured trips, AI planner, budget estimator, trending slider, and reviews
- `destinations.html` - Destination cards with search, filters, best-time labels, and saved trips
- `packages.html` - Package cards with filters, sorting, wishlist, and comparison modal
- `blog.html` - Travel tips and planning guides
- `gallery.html` - Filterable masonry gallery with lightbox
- `about.html` - Company story, mission, reasons to choose us, and developer profile
- `contact.html` - 3-step booking form and EmailJS-ready contact form
- `404.html` - Branded not found page

## EmailJS Setup

Open `script.js` and replace these values with your EmailJS credentials:

```js
publicKey: "YOUR_PUBLIC_KEY",
serviceId: "YOUR_SERVICE_ID",
bookingTemplateId: "YOUR_BOOKING_TEMPLATE_ID",
messageTemplateId: "YOUR_MESSAGE_TEMPLATE_ID",
```

Booking template parameters:

- `from_name`
- `from_email`
- `destination`
- `package_name`
- `travel_date`
- `travelers`
- `travel_notes`
- `emi_needed`
- `travelers_type`

Message template parameters:

- `from_name`
- `from_email`
- `message`

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- EmailJS-ready frontend form submission

## Developer

**Giridhar Reddy**  
Frontend Developer skilled in HTML, CSS, and JavaScript.

- GitHub: https://github.com/Giridhar113/Travel-with-Giridhar
- Portfolio: https://giridhar-portfolio-ten.vercel.app/

## How to Run

Open `index.html` in a browser, or serve the folder with any static server.

## Live Link

https://travel-with-giridhar.vercel.app/
