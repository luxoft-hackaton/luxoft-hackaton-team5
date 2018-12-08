const {Pool} = require('pg');
const {connectionString} = require('../config');
module.exports = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
});