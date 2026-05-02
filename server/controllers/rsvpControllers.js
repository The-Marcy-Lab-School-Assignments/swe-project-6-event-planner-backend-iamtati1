const rsvpModel = require('../models/rsvpModel');
const rsvpEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);
        const userId = req.session.userId;

        if (!req.session.userId) {
            return res.status(401).send({ message: 'Not logged in' });
        }
        const rsvp = await rsvpModel.create(userId, eventId);
        res.status(201).send(rsvp);
    } catch (err) {
        next(err);
    }
};

const removeRsvp = async (req, res, next) => {
    console.log("RSVP CONTROLLER LOADED");
    try {
        const eventId = Number(req.params.event_id);
        const userId = req.session.userId;
        if (!req.session.userId) {
            return res.status(401).send({ message: 'Not logged in' });
        }
        const result = await rsvpModel.remove(userId, eventId);
        res.send(result);
    } catch (err) {
        next(err);
    }
};

const listUserRsvps = async (req, res, next) => {
    try {
        const userId = Number(req.params.user_id);
        const rsvps = await rsvpModel.listByUser(userId);
        res.send(rsvps);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    rsvpEvent,
    removeRsvp,
    listUserRsvps
};