const { Pool } = require("pg");
const { parse } = require("pg-connection-string");
require("dotenv").config();

let config = {};

if (process.env.DATABASE_URL) {
  config = parse(process.env.DATABASE_URL);
  config.ssl = process.env.DATABASE_URL.includes("localhost") 
    ? false 
    : { rejectUnauthorized: false };
} else {
  config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

console.log("DB_CONFIG:", config); const pool = new Pool(config);

module.exports = pool;