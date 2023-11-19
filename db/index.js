const mysql = require("mysql2/promise");
const util = require("util");

const db = { connection: null };

(async () => {
  db.connection = await mysql.createConnection({
    host: "db4free.net",
    port: 3306,
    user:  "nghiangoo0810",
    password: "f3530af5",
    database: "store_11",
  });
  console.log("Database connected!");
})();

module.exports = db;
