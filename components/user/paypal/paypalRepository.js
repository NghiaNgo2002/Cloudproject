const db = require("../../../db/index");

exports.countHistory = async () => {
  let result = await db.connection.execute("select count(*) from history");
  return result[0][0]["count(*)"];
};

exports.insertHistoryandChangeBudget = async (idBill, userID, price) => {
  let today = new Date().toISOString().slice(0, 10);
  await db.connection.execute(
    "insert into history (`IDBILL`,`IDUSER`, `PRICE`,`TIME`, `STATUS`) VALUES (?,?,?,?,?)",
    [idBill, userID, price, today, "Waiting"]
  );
  const result = await db.connection.execute("Update accounts INNER JOIN history set accounts.Budget = accounts.Budget + " + price +
                                                    " , STATUS = 'Done' where  IDUSER = accounts.ID and IDBILL = ?", [idBill]);
  return result[0];
};