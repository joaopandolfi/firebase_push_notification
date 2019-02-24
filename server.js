// Libs
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
// Routes
const router = require('./routes');
// Firebase
const config = require('./credentials/config.js');

const app = express();

const conf = config.firebase;

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase App
admin.initializeApp({
  credential: admin.credential.cert(`./credentials/${conf.fileKey}`),
  databaseURL: conf.databaseURL,
});

// Routes
app.use('/', router);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

if (!module.parent) app.listen(process.env.PORT || 8080);

module.exports = app;
