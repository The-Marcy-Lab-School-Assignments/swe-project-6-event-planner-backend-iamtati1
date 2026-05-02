const eventModel = require('../models/eventModel');

// GET /api/events
const listEvents = async (req, res, next) => {
    try {
        const events = await eventModel.list();
        res.send(events);
    } catch (err) {
        next(err);
    }
};

// GET /api/users/:user_id/events
const listUserEvents = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);
        const events = await eventModel.listByUser(userId);
        res.send(events);
    } catch (err) {
        next(err);
    }
};

// POST /api/events
const createEvent = async (req, res, next) => {
    console.log("🔥 CREATE EVENT CONTROLLER RUNNING");
    try {
        console.log("CREATE EVENT HIT", req.body);
        const {
            title,
            description,
            date,
            location,
            event_type,
            max_capacity
        } = req.body;

        if (!title || !date || !location || !event_type || !max_capacity) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const event = await eventModel.create(
            req.session.userId,
            title,
            description,
            date,
            location,
            event_type,
            max_capacity
        );

        res.status(201).send(event);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/events/:event_id
const updateEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);

        const existing = await eventModel.find(eventId);
        if (!existing) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (existing.user_id !== req.session.userId) {
            return res.status(403).send({ message: 'You can only update your own events.' });
        }

        const {
            title,
            description,
            date,
            location,
            event_type,
            max_capacity
        } = req.body;

        const fields = {};

        if (title !== undefined) fields.title = title;
        if (description !== undefined) fields.description = description;
        if (date !== undefined) fields.date = date;
        if (location !== undefined) fields.location = location;
        if (event_type !== undefined) fields.event_type = event_type;
        if (max_capacity !== undefined) fields.max_capacity = max_capacity;

        const event = await eventModel.update(eventId, fields);

        res.send(event);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/events/:event_id
const deleteEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);

        const existing = await eventModel.find(eventId);
        if (!existing) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (existing.user_id !== req.session.userId) {
            return res.status(403).send({ message: 'You can only delete your own events.' });
        }

        const event = await eventModel.destroy(eventId);
        res.send(event);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listEvents,
    listUserEvents,
    createEvent,
    updateEvent,
    deleteEvent
};