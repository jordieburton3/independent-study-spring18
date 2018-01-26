const mysql = require('mysql');
const { MODE_PRODUCTION, MODE_TEST, PRODUCTION_DB, TEST_DB } = require('./constants');
require('dotenv').config();

let state = {
    pool: null,
    mode: null,
};

const connect = (mode, done) => {
    const config = {
      host: mode === MODE_PRODUCTION ? process.env.DATABASE_HOST : 'localhost',
      user: mode === MODE_PRODUCTION ? process.env.MYSQL_USERNAME : 'root',
      password: process.env.MYSQL_PASSWORD,
      database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
    };
  
    state.pool = mysql.createPool(config);
    state.mode = mode;

    console.log(config);

    done();
};

const queryAsync = async (query, params) => {
    return new Promise((resolve, reject) => {
      state.pool.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

const get = () => state.pool;

const disconnect = () => {
    get().end();
};

const testfunction = async () => {
    //await queryAsync(`INSERT INTO User (email, name, hash) values ('123', '456', '789')`, []);
    const values = await queryAsync('SELECT * FROM User');
    for (let index = 0; index < values.length; index++) {
        console.log(values[index].email);
    }
}

const db = {
    connect: connect,
    queryAsync: queryAsync,
    get: get,
    disconnect: disconnect,
    testfunction: testfunction
};

module.exports = {
    database: db
}
