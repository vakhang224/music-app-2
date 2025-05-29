const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config(); 

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password:process.env.PG_PASSWORD
  });

module.exports = pool
