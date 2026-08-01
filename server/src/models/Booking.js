const crypto = require("crypto");
const { query } = require("../config/db");

function toDateOnly(value) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function mapBooking(row) {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    package: row.package,
    destination: row.destination,
    travelDate: toDateOnly(row.travel_date),
    travelers: Number(row.travelers),
    message: row.message || "",
    travelType: row.travel_type || "",
    approxBudget: row.approx_budget || "",
    emiNeeded: row.emi_needed || "",
    travelersType: row.travelers_type || "",
    preferredContact: row.preferred_contact || "",
    paymentStatus: row.payment_status || "pending",
    amount: Number(row.amount || 0),
    amountSource: row.amount_source || "",
    razorpayOrderId: row.razorpay_order_id || "",
    razorpayPaymentId: row.razorpay_payment_id || "",
    status: row.status || "new",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createBooking(value) {
  const id = crypto.randomUUID();
  const rows = await query`
    INSERT INTO bookings (
      id,
      name,
      email,
      phone,
      package,
      destination,
      travel_date,
      travelers,
      message,
      travel_type,
      approx_budget,
      emi_needed,
      travelers_type,
      preferred_contact,
      payment_status,
      amount,
      amount_source,
      razorpay_order_id,
      razorpay_payment_id,
      status
    )
    VALUES (
      ${id},
      ${value.name},
      ${value.email},
      ${value.phone},
      ${value.package},
      ${value.destination},
      ${value.travelDate},
      ${Number(value.travelers)},
      ${value.message || ""},
      ${value.travelType || ""},
      ${value.approxBudget || ""},
      ${value.emiNeeded || ""},
      ${value.travelersType || ""},
      ${value.preferredContact || ""},
      ${value.paymentStatus || "pending"},
      ${Number(value.amount || 0)},
      ${value.amountSource || ""},
      ${value.razorpayOrderId || ""},
      ${value.razorpayPaymentId || ""},
      ${value.status || "new"}
    )
    RETURNING *
  `;

  return mapBooking(rows[0]);
}

async function findBookingById(id) {
  const rows = await query`
    SELECT *
    FROM bookings
    WHERE id = ${id}
    LIMIT 1
  `;

  return mapBooking(rows[0]);
}

async function findBookingByRazorpayOrderId(orderId) {
  const rows = await query`
    SELECT *
    FROM bookings
    WHERE razorpay_order_id = ${orderId}
    LIMIT 1
  `;

  return mapBooking(rows[0]);
}

async function updateBooking(id, patch) {
  const current = await findBookingById(id);

  if (!current) {
    return null;
  }

  const next = {
    status: patch.status !== undefined ? patch.status : current.status,
    paymentStatus:
      patch.paymentStatus !== undefined ? patch.paymentStatus : current.paymentStatus,
    razorpayOrderId:
      patch.razorpayOrderId !== undefined ? patch.razorpayOrderId : current.razorpayOrderId,
    razorpayPaymentId:
      patch.razorpayPaymentId !== undefined
        ? patch.razorpayPaymentId
        : current.razorpayPaymentId,
  };

  const rows = await query`
    UPDATE bookings
    SET
      status = ${next.status},
      payment_status = ${next.paymentStatus},
      razorpay_order_id = ${next.razorpayOrderId || ""},
      razorpay_payment_id = ${next.razorpayPaymentId || ""},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return mapBooking(rows[0]);
}

async function deleteBooking(id) {
  const rows = await query`
    DELETE FROM bookings
    WHERE id = ${id}
    RETURNING *
  `;

  return mapBooking(rows[0]);
}

async function listBookings({ status = "", paymentStatus = "", sortDirection = "desc" } = {}) {
  const sortAsc = sortDirection === "asc";
  let rows;

  if (status && paymentStatus) {
    rows = sortAsc
      ? await query`
          SELECT * FROM bookings
          WHERE status = ${status} AND payment_status = ${paymentStatus}
          ORDER BY created_at ASC
        `
      : await query`
          SELECT * FROM bookings
          WHERE status = ${status} AND payment_status = ${paymentStatus}
          ORDER BY created_at DESC
        `;
  } else if (status) {
    rows = sortAsc
      ? await query`
          SELECT * FROM bookings
          WHERE status = ${status}
          ORDER BY created_at ASC
        `
      : await query`
          SELECT * FROM bookings
          WHERE status = ${status}
          ORDER BY created_at DESC
        `;
  } else if (paymentStatus) {
    rows = sortAsc
      ? await query`
          SELECT * FROM bookings
          WHERE payment_status = ${paymentStatus}
          ORDER BY created_at ASC
        `
      : await query`
          SELECT * FROM bookings
          WHERE payment_status = ${paymentStatus}
          ORDER BY created_at DESC
        `;
  } else {
    rows = sortAsc
      ? await query`SELECT * FROM bookings ORDER BY created_at ASC`
      : await query`SELECT * FROM bookings ORDER BY created_at DESC`;
  }

  return rows.map(mapBooking);
}

async function countBookings({ status = "", paymentStatus = "", since = null } = {}) {
  let rows;

  if (status && paymentStatus && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND payment_status = ${paymentStatus} AND created_at >= ${since}
    `;
  } else if (status && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND created_at >= ${since}
    `;
  } else if (paymentStatus && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE payment_status = ${paymentStatus} AND created_at >= ${since}
    `;
  } else if (status && paymentStatus) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND payment_status = ${paymentStatus}
    `;
  } else if (status) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status}
    `;
  } else if (paymentStatus) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE payment_status = ${paymentStatus}
    `;
  } else if (since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE created_at >= ${since}
    `;
  } else {
    rows = await query`SELECT COUNT(*)::int AS count FROM bookings`;
  }

  return Number(rows[0] ? rows[0].count : 0);
}

async function revenueSince(since) {
  const rows = await query`
    SELECT COALESCE(SUM(amount), 0)::int AS total
    FROM bookings
    WHERE payment_status = 'paid' AND created_at >= ${since}
  `;

  return Number(rows[0] ? rows[0].total : 0);
}

module.exports = {
  countBookings,
  createBooking,
  deleteBooking,
  findBookingById,
  findBookingByRazorpayOrderId,
  listBookings,
  mapBooking,
  revenueSince,
  updateBooking,
};
