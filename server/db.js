const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "NBASoftware",
  password: "1234",
  port: 5432,
});

pool.connect()
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.error("Database Connection Error:", err));

module.exports = pool;