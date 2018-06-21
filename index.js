const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const users = require('./routes/users');
const auth = require('./routes/auth');
const shifts = require('./routes/shifts');

const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/sst')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(cors({
    origin : 'http://localhost:4200'
}));

app.use(express.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/shifts', shifts);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));