const { neon } = require("@neondatabase/serverless");

let sqlClient = null;
let schemaPromise = null;

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

function getSqlClient() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL. Add a Neon/Postgres SQL connection string in Vercel.");
  }

  if (!sqlClient) {
    sqlClient = neon(databaseUrl);
  }

  return sqlClient;
}

async function ensureDatabase() {
  if (!schemaPromise) {
    const sql = getSqlClient();

    schemaPromise = Promise.resolve()
      .then(async function () {
        await sql`
          CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            package TEXT NOT NULL,
            destination TEXT NOT NULL,
            travel_date DATE NOT NULL,
            travelers INTEGER NOT NULL,
            message TEXT NOT NULL DEFAULT '',
            travel_type TEXT NOT NULL DEFAULT '',
            approx_budget TEXT NOT NULL DEFAULT '',
            emi_needed TEXT NOT NULL DEFAULT '',
            travelers_type TEXT NOT NULL DEFAULT '',
            preferred_contact TEXT NOT NULL DEFAULT '',
            payment_status TEXT NOT NULL DEFAULT 'pending',
            amount INTEGER NOT NULL DEFAULT 0,
            amount_source TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'new',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;

        await sql`CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status)`;
      })
      .catch(function (error) {
        schemaPromise = null;
        throw error;
      });
  }

  await schemaPromise;
  return getSqlClient();
}

async function query(strings, ...values) {
  const sql = await ensureDatabase();
  return sql(strings, ...values);
}

module.exports = {
  ensureDatabase,
  getDatabaseUrl,
  query,
};
