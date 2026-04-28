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

        // USERS SEED
        await pool.query(`
      INSERT INTO users (username, password_hash) VALUES
      ('alice', 'hashedpassword1'),
      ('bob', 'hashedpassword2'),
      ('charlie', 'hashedpassword3');
    `);

        // EVENTS SEED
        await pool.query(`
      INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES
      ('Tech Conference', 'A big tech event', '2026-06-01', 'NYC', 'conference', 100, 1),
      ('React Workshop', 'Learn React', '2026-06-10', 'SF', 'workshop', 50, 2),
      ('Networking Night', 'Meet professionals', '2026-06-20', 'Chicago', 'networking', 75, 3);
    `);

        // RSVPS SEED
        await pool.query(`
      INSERT INTO rsvps (user_id, event_id) VALUES
      (1, 1),
      (2, 1),
      (3, 2),
      (1, 3);
    `);

        console.log("✅ Database seeded successfully!");
    } catch (err) {
        console.error("❌ Seeding error:", err);
    } finally {
        await pool.end();
    }
}

seed();

console.log("DATABASE =", process.env.PGDATABASE);

