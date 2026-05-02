// server/test.js
require('dotenv').config();
const eventModel = require('./models/eventModel');

const test = async () => {
    console.log(await eventModel.list());

    process.exit();
};

test();