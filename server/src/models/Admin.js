const crypto = require("crypto");
const { query } = require("../config/db");

function mapAdmin(row) {
  if (!row) {
    return null;
  }

  return {
    _id: row.id,
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAdminByEmail(email) {
  const rows = await query`
    SELECT *
    FROM admins
    WHERE email = ${email}
    LIMIT 1
  `;

  return mapAdmin(rows[0]);
}

async function countAdmins() {
  const rows = await query`SELECT COUNT(*)::int AS count FROM admins`;
  return Number(rows[0] ? rows[0].count : 0);
}

async function createAdmin({ email, passwordHash, role = "admin" }) {
  const id = crypto.randomUUID();
  const rows = await query`
    INSERT INTO admins (id, email, password_hash, role)
    VALUES (${id}, ${email}, ${passwordHash}, ${role})
    RETURNING *
  `;

  return mapAdmin(rows[0]);
}

async function upsertAdmin({ email, passwordHash, role = "admin" }) {
  const id = crypto.randomUUID();
  const rows = await query`
    INSERT INTO admins (id, email, password_hash, role)
    VALUES (${id}, ${email}, ${passwordHash}, ${role})
    ON CONFLICT (email)
    DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      updated_at = NOW()
    RETURNING *
  `;

  return mapAdmin(rows[0]);
}

module.exports = {
  countAdmins,
  createAdmin,
  findAdminByEmail,
  upsertAdmin,
};
