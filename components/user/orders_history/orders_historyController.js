const orders_historyService = require("./orders_historyService");

exports.orders_history = async (req, res) => {
  const userID = Object.values(req.user)[0];
  const history = await orders_historyService.getHistory(userID);
  for (let [key, value] of Object.entries(history)) {
    let str = value.TIME.toString();
    value.TIME = str.substring(0, 15);
  }
  res.render("user/orders_history/orders_history", {
    history,
    layout: "user_layout",
  });
};

exports.orders_history_food = async (req, res) => {
  const userID = Object.values(req.user)[0];
  const history = await orders_historyService.getHistoryFood(userID);
  for (let [key, value] of Object.entries(history)) {
    let str = value.TIME.toString();
    value.TIME = str.substring(0, 15);
  }
  res.render("user/orders_history/orders_history_food", {
    history,
    layout: "user_layout",
  });
};
