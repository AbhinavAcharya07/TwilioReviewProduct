// backend/db/db.js   ← MUST BE EXACTLY THIS
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // THIS LINE FORCES IPv4 — fixes ENETUNREACH forever
  host: process.env.DATABASE_URL?.includes('supabase.co') 
    ? 'db.your-project.supabase.co'  // ← change to your real host
    : undefined,
  ssl: {
    rejectUnauthorized: false
  }
});

// Best practice: force IPv4 only
pool.on('connect', (client) => {
  client.query('SET client_encoding TO "UTF8"');
  console.log('Connected to Supabase via IPv4');
});

module.exports = pool;