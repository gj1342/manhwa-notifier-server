const express = require('express');

const app = express();

app.use(express.json());

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

app.use('/api', routes);

app.use(errorHandler);

module.exports = app; 