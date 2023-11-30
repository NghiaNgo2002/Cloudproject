const mysql = require("mysql2/promise");
const util = require("util");

const db = { connection: null };

(async () => {
  db.connection = await mysql.createConnection({
    host: "mydb.cyrfdzhk5vns.ap-southeast-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "admin1234",
    database: "store",
  });
  console.log("Database connected!");
})();

module.exports = db;
