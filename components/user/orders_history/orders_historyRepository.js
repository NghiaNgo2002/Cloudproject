const db = require("../../../db/index");

exports.insertHistoryFood = async (idFoodBill, product, user, note) => {
  let today = new Date().toISOString().slice(0, 10);
  await db.connection.execute(
    "insert into history_food (`ID`,`NAME`, `COUNT`, `PRICE`, `TIME`,`USER_ID`,`NOTE`) VALUES (?,?,?,?,?,?,?)",
    [
      idFoodBill,
      product.name,
      product.quantity,
      product.price,
      today,
      user,
      note,
    ]
  );
};

exports.insertHistory = async (idBill, userID, price) => {
  let today = new Date().toISOString().slice(0, 10);
  await db.connection.execute(
    "insert into history (`IDBILL`,`IDUSER`, `PRICE`,`TIME`, `STATUS`) VALUES (?,?,?,?,?)",
    [idBill, userID, price, today, "Waiting"]
  );
};

exports.countHistory = async () => {
  let result = await db.connection.execute("select count(*) from history");
  return result[0][0]["count(*)"];
};

exports.countHistoryFood = async () => {
  let result = await db.connection.execute("select count(*) from history_food");
  return result[0][0]["count(*)"];
};

exports.getHistory = async (userID) => {
  const result = await db.connection.execute(
    "SELECT * FROM history where IDUSER like ?",
    [userID]
  );
  return result[0];
};

exports.getHistoryFood = async (userID) => {
  const result = await db.connection.execute(
    "SELECT * FROM history_food where USER_ID like ?",
    [userID]
  );
  return result[0];
};
