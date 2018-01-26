const mysql = require('mysql');
const { MODE_PRODUCTION, MODE_TEST, PRODUCTION_DB, TEST_DB } = require('./constants');
const { database } = require('./db');

// insert into user (email, name, hash) values ('abc', 'def', 'ghi');
// insert into user (email, name, hash) values ('123', '456', '789');


const createDatabaseQueries = [
    `DROP DATABASE IF EXISTS jmbisdev`,
    `DROP DATABASE IF EXISTS jmbisprod`,
    `CREATE DATABASE jmbisdev`,
    `CREATE DATABASE jmbisprod`,
  ];

  const Schemas = [
    `CREATE TABLE User (
        email varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        hash varchar(255) NOT NULL,
        privilege ENUM('owner', 'admin', 'user') NOT NULL,
        PRIMARY KEY (email)
      )`
      ,
    `CREATE TABLE Post (
        id int NOT NULL AUTO_INCREMENT,
        timestamp varchar(255) NOT NULL,
        text varchar(255) NOT NULL,
        PRIMARY KEY (id)
    )`
  ]

const Views = [];

const asyncQuery = (conn, query) => {
    return new Promise((resolve, reject) => {
      conn.query(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };
  
  const executeQueries = async (conn, queryArray) => {
    return new Promise(async (resolve, reject) => {
      for (let query of queryArray) {
        try {
          await asyncQuery(conn, query);
        } catch (err) {
          reject(err);
        }
      }
      resolve();
    });
  };
  
  // This is what callback hell looks like - should use async / await
const seed = mode => {
    const prod = mode === MODE_PRODUCTION;
    // Create a separate connection for creating the database. Don't do this on
    // prod as we only get one database
    const initialConnection = prod
      ? null
      : mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: process.env.MYSQL_PASSWORD,
        });
  
    const seedConnection = mysql.createConnection({
      host: prod ? process.env.DATABASE_HOST : 'localhost',
      user: prod ? process.env.MYSQL_USERNAME : 'root',
      password: process.env.MYSQL_PASSWORD,
      database: prod ? PRODUCTION_DB : TEST_DB,
    });
  
    return new Promise(async (resolve, reject) => {
      try {
        if (!prod) {
          await executeQueries(initialConnection, createDatabaseQueries);
          initialConnection.end();
        }
        await executeQueries(seedConnection, Schemas);
        await executeQueries(seedConnection, Views);
        seedConnection.end();
        process.exit(0);
      } catch (err) {
        console.log(err);
      }
    });
  };

  module.exports = {
      seed: seed
  }
