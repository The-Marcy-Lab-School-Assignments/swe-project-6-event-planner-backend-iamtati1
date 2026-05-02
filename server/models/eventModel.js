// NEW file — event model(mirrors the pattern in userModel.js)
const pool = require('../db/pool');


// Returns all events with the username of the creator and rsvp_count.
// The JOIN is what makes the public feed possible — without it we'd only have user_id.
module.exports.list = async () => {
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
      users.username,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    GROUP BY events.event_id, users.user_id, users.username
    ORDER BY events.date ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};


// Returns all events created by a specific user
module.exports.listByUser = async (user_id) => {
  const query = `
    SELECT event_id, title, description, date, location, event_type, max_capacity, user_id
    FROM events
    WHERE user_id = $1
    ORDER BY event_id
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Creates an event owned by the user
module.exports.create = async (
  user_id,
  title,
  description,
  date,
  location,
  event_type,
  max_capacity
) => {
  const query = `
    INSERT INTO events (
      title,
      description,
      date,
      location,
      event_type,
      max_capacity,
      user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    title,
    description,
    date,
    location,
    event_type,
    max_capacity,
    user_id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


// Finds a single event by id — used by updateEvent and deleteEvent before ownership checks.
// We look it up in the database to confirm the event exists and to determine its owner (user_id)
// since the request only provides event_id, not ownership information.
module.exports.find = async (event_id) => {
  const query =
    `SELECT event_id, title, description, date, location, event_type, max_capacity, user_id
    FROM events
    WHERE event_id = $1
  `;

  const { rows } = await pool.query(query, [event_id]);
  return rows[0] || null;
};
// Updates an event's details
module.exports.update = async (event_id, fields) => {
  const keys = Object.keys(fields);

  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");

  const values = Object.values(fields);

  values.push(event_id);

  const query = `
    UPDATE events
    SET ${setClause}
    WHERE event_id = $${values.length}
    RETURNING event_id, title, description, date, location, event_type, max_capacity, user_id
  `;

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};

// Deletes an event — returns the deleted row or null
module.exports.destroy = async (event_id) => {
  const query = `
    DELETE FROM events
    WHERE event_id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [event_id]);
  return rows[0] || null;
};