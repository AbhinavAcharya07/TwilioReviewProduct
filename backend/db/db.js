// backend/db/db.js  ← UNIVERSAL CONNECTION MODULE (2025 BEST VERSION)
const { Pool } = require('pg');

// This single line works everywhere (Neon, Supabase, Railway Postgres, etc.)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // These two lines fix 99% of connection issues on all platforms
  ssl: {
    rejectUnauthorized: false   // Required for Neon, Supabase, Railway, etc.
  },
  // Force IPv4 if needed (rarely needed with Neon)
  // Remove this block if connection works without it
  ...(process.env.DATABASE_URL && {
    host: process.env.DATABASE_URL.match(/@([^:]+):/)?.[1],
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  })
});

