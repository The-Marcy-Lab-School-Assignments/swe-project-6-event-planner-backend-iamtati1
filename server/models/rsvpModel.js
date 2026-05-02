const pool = require('../db/pool');

/**
 * RSVP a user to an event
 * If already exists, return null (silent success per contract)
 */
module.exports.create = async (user_id, event_id) => {
    // Check if RSVP already exists
    const checkQuery = `
    SELECT * FROM rsvps
    WHERE user_id = $1 AND event_id = $2
  `;
    const existing = await pool.query(checkQuery, [user_id, event_id]);

    if (existing.rows.length > 0) {
        return null; // silent success
    }

    const insertQuery = `
    INSERT INTO rsvps (user_id, event_id)
    VALUES ($1, $2)
    RETURNING *
  `;

    const { rows } = await pool.query(insertQuery, [user_id, event_id]);
    return rows[0];
};

/**
 * Remove RSVP
 */
module.exports.remove = async (user_id, event_id) => {
    const query = `
    DELETE FROM rsvps
    WHERE user_id = $1 AND event_id = $2
    RETURNING *
  `;

    const { rows } = await pool.query(query, [user_id, event_id]);
    return rows[0] || null;
};

/**
 * Get all events a user RSVPed to (FULL event objects)
 */
module.exports.listByUser = async (user_id) => {
    const query = `
    SELECT 
      events.event_id,
      events.title,
      events.description,
      events.date,
      events.location,
      events.event_type,
      events.max_capacity,
      events.user_id,
      COUNT(rsvps2.rsvp_id) AS rsvp_count
    FROM events
    JOIN rsvps r ON events.event_id = r.event_id
    LEFT JOIN rsvps rsvps2 ON events.event_id = rsvps2.event_id
    WHERE r.user_id = $1
    GROUP BY events.event_id
    ORDER BY events.date;
  `;

    const { rows } = await pool.query(query, [user_id]);
    return rows;
};