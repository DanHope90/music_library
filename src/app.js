const express = require('express');

const app = express();

const router = require('./routes/artist');

app.use(express.json());

app.use('/artist', router);

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

module.exports = app;
