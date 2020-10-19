'use strict';

require('dotenv').config();

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const paginate = require('express-paginate');

const app = express();

// keep this before all routes that will use pagination
// limit: a Number to limit results returned per page (defaults to 10)
// maxLimit: a Number to restrict the number of results returned to per page (defaults to 50)
app.use(paginate.middleware(10, 50));

// config origin for cors
const corsOptions = {
  origin: process.env.WEB_CLIENT_URL || 'http://localhost:3300',
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// allow parse for content-type: application/json
app.use(bodyParser.json());
// allow parse for content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// index root
app.get('/', (req, res) => {
  res.json({ message: 'ok!' });
});
// routes
require('./routes/auth.routes')(app);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at port ${PORT}.`);
});
