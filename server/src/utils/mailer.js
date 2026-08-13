const nodemailer = require("nodemailer");

let transporter = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";

  return {
    configured: Boolean(host && user && pass && from),
    host,
    port,
    user,
    pass,
    from,
  };
}

function getTransporter() {
  const config = getSmtpConfig();

  if (!config.configured) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return transporter;
}

function statusCopy(status) {
  const messages = {
    new: {
      subject: "We received your travel request",
      title: "Your trip request is in our booking desk",
      body: "Thanks for sharing your travel details. Our team will review your request and contact you with the next steps.",
    },
    contacted: {
      subject: "Your travel request is being reviewed",
      title: "We are checking your trip details",
      body: "Your request has been picked up by our booking desk. We will continue the conversation on your preferred contact channel.",
    },
    confirmed: {
      subject: "Your trip request is confirmed",
      title: "Your travel plan is confirmed",
      body: "Your booking request has been marked as confirmed. Please stay available on WhatsApp for the final itinerary and next steps.",
    },
    closed: {
      subject: "Your travel request has been closed",
      title: "Your booking request is closed",
      body: "This travel inquiry has been closed. If you still need help planning the trip, reply to this email or message us on WhatsApp.",
    },
  };

  return messages[status] || messages.contacted;
}

function buildStatusEmailHtml(booking, status) {
  const copy = statusCopy(status);

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;color:#111827;">
      <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:18px;padding:26px;border:1px solid #e5e7eb;">
        <p style="margin:0 0 8px;color:#14b8a6;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">Travel with Giridhar</p>
        <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;">${copy.title}</h1>
        <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.7;">${copy.body}</p>
        <div style="background:#f9fafb;border-radius:14px;padding:16px;margin-bottom:20px;">
          <p style="margin:0 0 8px;"><strong>Destination:</strong> ${booking.destination}</p>
          <p style="margin:0 0 8px;"><strong>Package:</strong> ${booking.package}</p>
          <p style="margin:0 0 8px;"><strong>Travel date:</strong> ${booking.travelDate}</p>
          <p style="margin:0;"><strong>Status:</strong> ${status}</p>
        </div>
        <a href="https://wa.me/918179721034" style="display:inline-block;background:#ff6b57;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:800;">Chat on WhatsApp</a>
      </div>
    </div>
  `;
}

async function sendBookingStatusEmail(booking, status) {
  const mailer = getTransporter();
  const config = getSmtpConfig();

  if (!mailer) {
    return {
      sent: false,
      configured: false,
      reason: "SMTP email is not configured.",
    };
  }

  const copy = statusCopy(status);

  await mailer.sendMail({
    from: config.from,
    to: booking.email,
    subject: `${copy.subject} - Travel with Giridhar`,
    text: `${copy.title}\n\n${copy.body}\n\nDestination: ${booking.destination}\nPackage: ${booking.package}\nTravel date: ${booking.travelDate}\nStatus: ${status}\n\nWhatsApp: https://wa.me/918179721034`,
    html: buildStatusEmailHtml(booking, status),
  });

  return {
    sent: true,
    configured: true,
  };
}

module.exports = {
  getSmtpConfig,
  sendBookingStatusEmail,
};
