const db = require('../../db/index');

exports.verifyAccount = async(ID) => {
    await db.connection.execute("UPDATE accounts SET VERIFIED = ? WHERE ID = ?;", ['1',ID]);
}

exports.changePassword = async(newpassword, email) => {
    await db.connection.execute("UPDATE accounts SET PASSWORD = ? WHERE EMAIL = ?;", [newpassword, email]);
}