const express = require('express');
const bodyParser = require('body-parser');
const { MODE_PRODUCTION, MODE_TEST, PRODUCTION_DB, TEST_DB } = require('./helpers/database/constants');
const { database } = require('./helpers/database/db');
const jwt = require('jsonwebtoken');
const User = require('./models/users/User');
const Admin = require('./models/users/Admin');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
const mode =
  process.env.NODE_ENV === 'production' ? MODE_PRODUCTION : MODE_TEST;


require('./routes/User')(app);
require('./routes/Course')(app);

database.connect(mode, function(err) {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
      // Define the port we are listening on
      app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
      });
    }
  });
