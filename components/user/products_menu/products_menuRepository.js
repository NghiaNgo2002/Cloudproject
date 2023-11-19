const db = require("../../../db");

exports.getAll = async () => {
  const result = await db.connection.execute("SELECT * FROM menu");
  return result[0];
};

exports.count = async (name) => {
  let result;
  if (name != "") {
    result = await db.connection.execute(
      "select count(*) from menu where name like ? or category like ?",
      [`%${name}%`, `%${name}%`]
    );
  } else {
    result = await db.connection.execute("select count(*) from menu");
  }
  return result[0][0]["count(*)"];
};

exports.getLimit = async (limit, offset, name = "") => {
  const result = await db.connection.execute(
    "SELECT * FROM menu where name like ? or category like ? limit " +
      limit +
      " offset " +
      offset,
    [`%${name}%`, `%${name}%`]
  );
  return result[0];
};

exports.getCategory = async (category) => {
  const result = await db.connection.execute(
    "SELECT * FROM menu where CATEGORY like ?",
    [category]
  );
  return result[0];
};

exports.filter = async (name) => {
  const result = await db.connection.execute(
    "select * from menu where name like ? or category like ?",
    [`%${name}%`, `%${name}%`]
  );
  return result[0];
};

exports.get = async (id) => {
  const result = await db.connection.execute(
    "SELECT * FROM menu where id = ?",
    [parseInt(id)]
  );
  return result[0][0];
};
