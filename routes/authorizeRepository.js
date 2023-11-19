const db = require('../db/index');

exports.getAccount = async(username, password) => {
    const result = await db.connection.execute("SELECT * FROM accounts where PHONENUMBER like ? and PASSWORD like ?;", [username, password]);
    console.log(result[0][0]);
    return result[0][0];
}