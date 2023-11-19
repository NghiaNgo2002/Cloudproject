const db = require("../../../db");

exports.get = async (id) => {
  const result = await db.connection.execute(
    "select * from menu where id = ?",
    [id]
  );
  return result[0][0];
};

exports.getReviewList = async (productID, limit, offset) => {
  const result = await db.connection.execute(
    "SELECT ac.FULLNAME,rv.* FROM review rv join accounts ac on rv.IDUSER = ac.ID where IDPRODUCT like ? limit " +
      limit +
      " offset " +
      offset,
    [productID]
  );
  return result[0];
};

exports.countReviewList = async (productId) => {
  let result;
  result = await db.connection.execute(
    "select count(*) from review where IDPRODUCT = ?",
    [productId]
  );

  return result[0][0]["count(*)"];
};

exports.insertReview = async (userID, productID, comment) => {
  let today = new Date();
  await db.connection.execute(
    "insert into review (`IDUSER`, `IDPRODUCT`,`TIME`, `COMMENT`) VALUES (?,?,?,?)",
    [userID, productID, today, comment]
  );
};
