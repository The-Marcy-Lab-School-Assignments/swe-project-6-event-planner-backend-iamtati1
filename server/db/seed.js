require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./pool");

const SALT_ROUNDS = 8;

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // DROP TABLES
    await pool.query(`
      DROP TABLE IF EXISTS rsvps;
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS users;
    `);

    // USERS
    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    // EVENTS
    await pool.query(`
      CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        event_type TEXT NOT NULL,
        max_capacity INTEGER NOT NULL,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);

    // RSVPS
    await pool.query(`
      CREATE TABLE rsvps (
        rsvp_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id)
      );
    `);


    //1. Hash the passwords first
    const aliceHash = await bcrypt.hash('password123', SALT_ROUNDS);
    const bobHash = await bcrypt.hash('bobword498', SALT_ROUNDS);
    const charlieHash = await bcrypt.hash('foodItems', SALT_ROUNDS);

    //2. Define a SQL query string that returns user_id
    const insertUserSql = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id';

    //3. Execute queries and store the full result objects
    const aliceResponse = await pool.query(insertUserSql, ['alice', aliceHash]);
    const bobResponse = await pool.query(insertUserSql, ['bob', bobHash]);
    const charlieResponse = await pool.query(insertUserSql, ['charlie', charlieHash]);

    //4. Extract IDs for later use (e.g., seeding bookmarks)
    const aliceId = aliceResponse.rows[0].user_id;
    const bobId = bobResponse.rows[0].user_id;
    const charlieId = charlieResponse.rows[0].user_id;

    //5. Seed some Data for EVENTs so the app has data has data to display on first load
    const eventQuery = 'INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    await pool.query(eventQuery, ['Frontend Study Jam', 'A casual session to practice JavaScript and build mini projects together.', '2026-05-05', 'Brooklyn, NY', 'study', 30, aliceId]);
    await pool.query(eventQuery, ['React Workshop', 'Hands-on workshop focused on React hooks and component design.', '2026-05-10', 'New York City, NY', 'workshop', 50, bobId]);
    await pool.query(eventQuery, ['Networking Night', 'Meet professionals and build connections', '2026-06-20', 'Chicago', 'networking', 75, charlieId]);

    //Data for RSVPs
    const rsvpsQuery = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)';
    await pool.query(rsvpsQuery, [aliceId, 1]);
    await pool.query(rsvpsQuery, [bobId, 2]);
    await pool.query(rsvpsQuery, [charlieId, 3]);

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await pool.end();
  }
}

seed();

console.log("DATABASE =", process.env.PGDATABASE);

