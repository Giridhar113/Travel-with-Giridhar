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
    contactChannel: row.contact_channel || "whatsapp",
    amount: Number(row.amount || 0),
    amountSource: row.amount_source || "",
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
      contact_channel,
      amount,
      amount_source,
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
      ${value.contactChannel || "whatsapp"},
      ${Number(value.amount || 0)},
      ${value.amountSource || ""},
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

async function findBookingsByContact({ email = "", phone = "" } = {}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const phoneDigits = String(phone || "").replace(/\D/g, "");
  const phoneTail = phoneDigits.slice(-10);

  if (!normalizedEmail || phoneTail.length < 7) {
    return [];
  }

  const rows = await query`
    SELECT *
    FROM bookings
    WHERE LOWER(email) = ${normalizedEmail}
      AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), ${phoneTail.length}) = ${phoneTail}
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return rows.map(mapBooking);
}

async function updateBooking(id, patch) {
  const current = await findBookingById(id);

  if (!current) {
    return null;
  }

  const next = {
    status: patch.status !== undefined ? patch.status : current.status,
    contactChannel:
      patch.contactChannel !== undefined ? patch.contactChannel : current.contactChannel,
  };

  const rows = await query`
    UPDATE bookings
    SET
      status = ${next.status},
      contact_channel = ${next.contactChannel},
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

async function listBookings({ status = "", contactChannel = "", sortDirection = "desc" } = {}) {
  const sortAsc = sortDirection === "asc";
  let rows;

  if (status && contactChannel) {
    rows = sortAsc
      ? await query`
          SELECT * FROM bookings
          WHERE status = ${status} AND contact_channel = ${contactChannel}
          ORDER BY created_at ASC
        `
      : await query`
          SELECT * FROM bookings
          WHERE status = ${status} AND contact_channel = ${contactChannel}
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
  } else if (contactChannel) {
    rows = sortAsc
      ? await query`
          SELECT * FROM bookings
          WHERE contact_channel = ${contactChannel}
          ORDER BY created_at ASC
        `
      : await query`
          SELECT * FROM bookings
          WHERE contact_channel = ${contactChannel}
          ORDER BY created_at DESC
        `;
  } else {
    rows = sortAsc
      ? await query`SELECT * FROM bookings ORDER BY created_at ASC`
      : await query`SELECT * FROM bookings ORDER BY created_at DESC`;
  }

  return rows.map(mapBooking);
}

async function countBookings({ status = "", contactChannel = "", since = null } = {}) {
  let rows;

  if (status && contactChannel && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND contact_channel = ${contactChannel} AND created_at >= ${since}
    `;
  } else if (status && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND created_at >= ${since}
    `;
  } else if (contactChannel && since) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE contact_channel = ${contactChannel} AND created_at >= ${since}
    `;
  } else if (status && contactChannel) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status} AND contact_channel = ${contactChannel}
    `;
  } else if (status) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE status = ${status}
    `;
  } else if (contactChannel) {
    rows = await query`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE contact_channel = ${contactChannel}
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

async function quoteValueSince(since) {
  const rows = await query`
    SELECT COALESCE(SUM(amount), 0)::int AS total
    FROM bookings
    WHERE contact_channel = 'whatsapp' AND created_at >= ${since}
  `;

  return Number(rows[0] ? rows[0].total : 0);
}

module.exports = {
  countBookings,
  createBooking,
  deleteBooking,
  findBookingById,
  findBookingsByContact,
  listBookings,
  mapBooking,
  quoteValueSince,
  updateBooking,
};
