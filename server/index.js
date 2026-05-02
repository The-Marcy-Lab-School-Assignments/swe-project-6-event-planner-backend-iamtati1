require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');


const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
// controllers
const { register, login, getMe, logout } = require('./controllers/authControllers');
const { listUsers, updateUser, deleteUser } = require('./controllers/userControllers');
const { listEvents, createEvent, updateEvent, deleteEvent, listUserEvents } = require('./controllers/eventControllers'); // NEW

const { rsvpEvent, removeRsvp, listUserRsvps } = require('./controllers/rsvpControllers');

const app = express();

// middleware
app.use(express.json());

//Middleware
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    httpOnly: true
}));
/* 
HELPS CHECK FUNCTIONS ARE RUNNING
console.log({
    listUsers: typeof listUsers,
    updateUser: typeof updateUser,
    deleteUser: typeof deleteUser,

    listEvents: typeof listEvents,
    createEvent: typeof createEvent,
    updateEvent: typeof updateEvent,
    deleteEvent: typeof deleteEvent,

    rsvpEvent: typeof rsvpEvent,
    removeRsvp: typeof removeRsvp,
    listUserRsvps: typeof listUserRsvps,

    checkAuthentication: typeof checkAuthentication
});
*/
// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getMe);
app.delete('/api/auth/logout', logout);

//User Routes
app.patch('/api/users/:user_id', checkAuthentication, updateUser);
app.delete('/api/users/:user_id', checkAuthentication, deleteUser);

//Event Routes
app.get('/api/events', listEvents);
app.post('/api/events', checkAuthentication, createEvent);
app.patch('/api/events/:event_id', checkAuthentication, updateEvent);
app.delete('/api/events/:event_id', checkAuthentication, deleteEvent);

app.get('/api/users/:user_id/events', listUserEvents);

//RSVP Routes
app.post('/api/events/:event_id/rsvps', checkAuthentication, rsvpEvent);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, removeRsvp);
app.get('/api/users/:user_id/rsvps', listUserRsvps);

// health check
app.get('/', (req, res) => {
    res.json({ message: 'API running 🚀' });
});

// ✍️ TODO 2: Replace hard-coded PORT with `process.env.PORT || 8080`
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const pathToFrontend = process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';


