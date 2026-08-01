# Travel with Giridhar Backend + Admin

This project keeps the public travel website as static HTML/CSS/JS and adds a separate Express API for booking storage, Razorpay payments, and admin management.

## Architecture

```txt
public static site/
  contact.html -> fetch POST /api/bookings -> Razorpay Checkout

server/
  src/
    models/Booking.js
    models/Admin.js
    routes/bookings.js
    routes/payments.js
    routes/admin.js
    utils/packagePricing.js
    utils/razorpay.js

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
- MongoDB + Mongoose
- JWT admin auth
- bcrypt password hashing
- Razorpay Orders + payment signature verification
- express-rate-limit on public booking submissions

## Environment Variables

Copy either root `.env.example` or `server/.env.example` to `server/.env`:

```txt
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_SEED_EMAIL=your_admin_email
ADMIN_SEED_PASSWORD=your_admin_password
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500,https://travel-with-giridhar.vercel.app
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Use Razorpay test-mode keys locally. For live payments, replace them with live keys in the deployed backend environment only. Never expose `RAZORPAY_KEY_SECRET`.

## Run Locally

Install and start the API:

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
For local file/localhost previews it uses:

```js
apiBaseUrl: "http://localhost:5000"
```

On the live Vercel site it now uses the same origin:

```js
apiBaseUrl: window.location.origin
```

That means production bookings call:

```txt
https://travel-with-giridhar.vercel.app/api/bookings
```

The wrapper for the Express API lives in `api/[...path].js`. Add the required MongoDB, JWT, and Razorpay environment variables in Vercel before expecting the full payment flow to work. If they are missing, the frontend falls back to a pre-filled WhatsApp booking message.

## Booking Flow

`contact.html` posts booking data to:

```txt
POST /api/bookings
```

The server:

1. Validates required fields.
2. Looks up the selected package amount from shared `data.js`.
3. Saves a booking with `paymentStatus: pending`.
4. Creates a Razorpay Order.
5. Returns public checkout data: `bookingId`, `orderId`, `amount`, `currency`, and Razorpay public key.

The browser opens Razorpay Checkout. After payment success, it calls:

```txt
POST /api/payments/verify
```

The backend verifies the Razorpay signature before marking the booking as `paid`.

If checkout is dismissed, the booking stays saved and users can retry with:

```txt
contact.html?bookingId=BOOKING_ID#bookingForm
```

That page calls:

```txt
POST /api/payments/retry
```

## Payment Webhook

Configure this URL in Razorpay Dashboard after deploying the backend:

```txt
POST https://YOUR_API_DOMAIN/api/payments/webhook
```

Enable at least:

- `payment.captured`
- `payment.failed`

The webhook verifies `x-razorpay-signature` using `RAZORPAY_WEBHOOK_SECRET`.

## Admin API

Login:

```txt
POST /api/admin/login
```

List bookings:

```txt
GET /api/admin/bookings?status=new&paymentStatus=paid&sort=desc
```

Update lead status:

```txt
PATCH /api/admin/bookings/:id
```

Body:

```json
{ "status": "contacted" }
```

Delete spam/test booking:

```txt
DELETE /api/admin/bookings/:id
```

Admin tokens are stored in `sessionStorage` on the admin pages, not `localStorage`.

## Deploy

Recommended setup:

1. Keep the static website on Vercel.
2. Use `api/[...path].js` to run the Express API inside the same Vercel project.
3. Add all backend environment variables in the Vercel project dashboard.
4. Use a MongoDB Atlas `mongodb+srv://...` connection string for `MONGODB_URI`. Do not use `localhost` or `127.0.0.1` in production.
5. Set `CORS_ORIGIN` to your public frontend URL:

```txt
https://travel-with-giridhar.vercel.app
```

6. Redeploy the Vercel project after changing environment variables.
7. Open `/admin/login.html` and log in with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`. If no admin exists yet, the backend creates the first admin automatically.
8. Add the Razorpay webhook URL in Razorpay Dashboard:

```txt
https://travel-with-giridhar.vercel.app/api/payments/webhook
```

Do not commit real `.env` files or real Razorpay/MongoDB/JWT secrets.
