require('dotenv').config();
const { seed } = require('./helpers/database/schema');
const { MODE_PRODUCTION, MODE_TEST, PRODUCTION_DB, TEST_DB } = require('./helpers/database/constants');
const { database } = require('./helpers/database/db');

const mode =
  process.env.NODE_ENV === 'production' ? MODE_PRODUCTION : MODE_TEST;

seed(mode, err => {
  if (err) console.log(err);
  db.disconnect();
});