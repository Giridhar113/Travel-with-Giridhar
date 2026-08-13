# Travel with Giridhar Backend + Admin

This project keeps the public travel website as static HTML/CSS/JS and adds an Express API for booking storage, WhatsApp handoff, admin management, and optional customer status emails.

## Architecture

```txt
public static site/
  contact.html -> fetch POST /api/bookings -> SQL database -> WhatsApp handoff

server/
  src/
    models/Booking.js
    models/Admin.js
    routes/bookings.js
    routes/admin.js
    utils/packagePricing.js
    utils/mailer.js

admin/
  login.html
  dashboard.html
  bookings.html
  admin.css
  admin.js
```

The admin dashboard is vanilla HTML/CSS/JS. It uses Chart.js from CDN, so there is no build step.

## Backend Stack

- Node.js + Express
- PostgreSQL/Neon SQL
- JWT admin auth
- bcrypt password hashing
- Nodemailer SMTP status emails
- express-rate-limit on public booking submissions

## Environment Variables

Copy either root `.env.example` or `server/.env.example` to `server/.env`:

```txt
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_SEED_EMAIL=your_admin_email
ADMIN_SEED_PASSWORD=your_admin_pin
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,https://travel-with-giridhar.vercel.app
WHATSAPP_NUMBER=918179721034
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your_email_app_password
SMTP_FROM="Travel with Giridhar <your-email@example.com>"
```

SMTP is optional. If SMTP is missing, status changes still save in SQL, but customer email notifications are skipped.

## Run Locally

```bash
cd server
npm install
npm run seed:admin
npm run dev
```

Open the static site with a local server, for example VS Code Live Server:

```txt
http://localhost:5500/index.html
```

Admin pages:

```txt
http://localhost:5500/admin/login.html
http://localhost:5500/admin/dashboard.html
http://localhost:5500/admin/bookings.html
```

The static pages read the API base URL from `site-config.js`.

## Booking Flow

`contact.html` posts booking data to:

```txt
POST /api/bookings
```

The server:

1. Validates required fields.
2. Looks up the selected package amount from shared `data.js`.
3. Saves a booking in SQL with contact channel `whatsapp`.
4. Returns `bookingId`, `booking`, and a prefilled `whatsappUrl`.

The browser opens WhatsApp with the booking details. The user presses Send to continue the conversation.

## Admin Flow

Login:

```txt
POST /api/admin/login
```

List bookings:

```txt
GET /api/admin/bookings?status=new&contactChannel=whatsapp&sort=desc
```

Update lead status:

```txt
PATCH /api/admin/bookings/:id
```

Body:

```json
{ "status": "contacted" }
```

When status changes, the backend attempts to send a customer email through SMTP. The response includes:

```json
{
  "success": true,
  "emailNotification": {
    "sent": true,
    "configured": true
  }
}
```

Delete spam/test booking:

```txt
DELETE /api/admin/bookings/:id
```

Admin tokens are stored in `sessionStorage` on the admin pages, not `localStorage`.

## Deploy

1. Keep the static website on Vercel.
2. Use the `api/` wrappers to run the Express API inside the same Vercel project.
3. Add all backend environment variables in the Vercel project dashboard.
4. Use a Neon/Postgres SQL connection string for `DATABASE_URL`.
5. Set `CORS_ORIGIN` to your public frontend URL:

```txt
https://travel-with-giridhar.vercel.app
```

6. Redeploy the Vercel project after changing environment variables.
7. Open `/admin/login.html`.

The public demo login uses:

```txt
admin@travelwithgiridhar.local
PIN: 123456
```

Demo mode is read-only and shows sample bookings. Use `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` for full access.

Do not commit real `.env` files or real SQL/JWT/SMTP secrets.
