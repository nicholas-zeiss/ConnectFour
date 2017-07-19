/**
This module is required in our knexfile so that on a new knex migration we are ensured the existence of the database.
**/

const sqlite = require('sqlite3');
const path = require('path');

//if no database exists create one and close, otherwise just open it and close
module.exports = new sqlite.Database(path.join(__dirname, '/data/data.sqlite')).close();

