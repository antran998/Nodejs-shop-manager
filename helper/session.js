const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);

const {sequelize} = require('../models/index');

const store = new SessionStore({
    db: sequelize,
    table: 'session',    
});

const options = {
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
};

module.exports = session(options);
