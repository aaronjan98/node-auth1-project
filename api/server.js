const express = require('express');

const apiRouter = require('./api-router.js');
const configureMiddleware = require('./configure-middleware.js');

const knex = require("../database/dbConfig.js"); // needed for storing sessions in the database
const session = require("express-session"); // npm i express-session
const KnexStore = require("connect-session-knex")(session); // remember to curry and pass the session

const server = express();

const sessionConfig = {
    name: "monster",
    secret: "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: true, // related to GDPR compliance
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, // should be true in production
      httpOnly: true, // true means JS can't touch the cookie
    },
    // remember the new keyword
    store: new KnexStore({
      knex,
      tablename: "sessions",
      createtable: true,
      sidfieldname: "sid",
      clearInterval: 1000 * 60 * 15,
    }),
};

configureMiddleware(server);

server.use(session(sessionConfig));
server.use('/api', apiRouter);

server.get("/", (req, res) => {
    console.log(req.session);
    res.json({ api: "up" });
  });

module.exports = server;
