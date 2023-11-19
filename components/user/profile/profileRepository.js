const db = require("../../../db/index");

exports.editInfo = async (
  fullname,
  phonenumber,
  email,
  current_phonenumber
) => {
  await db.connection.execute(
    "UPDATE accounts SET FULLNAME = ?, PHONENUMBER = ?, EMAIL = ? WHERE PHONENUMBER = ?;",
    [fullname, phonenumber, email, current_phonenumber]
  );
  const result = await db.connection.execute(
    "SELECT * FROM accounts where PHONENUMBER like ?;",
    [phonenumber]
  );
  return result[0][0];
};

exports.changePassword = async (newpassword, phonenumber) => {
  await db.connection.execute(
    "UPDATE accounts SET PASSWORD = ? WHERE PHONENUMBER = ?;",
    [newpassword, phonenumber]
  );
  const result = await db.connection.execute(
    "SELECT * FROM accounts where PHONENUMBER like ?;",
    [phonenumber]
  );
  return result[0][0];
};

exports.editAvatar = async (id) => {
  await db.connection.execute("UPDATE accounts SET IMAGE = ? WHERE ID = ?;", [
    `profile-img-${id}.jpg`,
    id,
  ]);
  const result = await db.connection.execute(
    "SELECT * FROM accounts where ID like ?;",
    [id]
  );
  return result[0][0];
};

exports.removeAvatar = async (id) => {
  await db.connection.execute("UPDATE accounts SET IMAGE = ? WHERE ID = ?;", [
    "default-user.jpg",
    id,
  ]);
  const result = await db.connection.execute(
    "SELECT * FROM accounts where ID like ?;",
    [id]
  );
  return result[0][0];
};

exports.editBudget = async (id, money) => {
  await db.connection.execute("UPDATE accounts SET BUDGET = ? WHERE ID = ?;", [
    money,
    id,
  ]);
  const result = await db.connection.execute(
    "SELECT * FROM accounts where ID like ?;",
    [id]
  );
  return result[0][0];
};

exports.getProfile = async (id) => {
  const result = await db.connection.execute(
    "SELECT * FROM accounts where ID like ?;",
    [id]
  );
  return result[0][0];
};
