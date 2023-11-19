const orders_historyRepository = require("./orders_historyRepository");

exports.insertHistoryFood = async (idFoodBill, product, user, note) => {
  await orders_historyRepository.insertHistoryFood(
    idFoodBill,
    product,
    user,
    note
  );
};

exports.insertHistory = async (idBill, userID, price) => {
  await orders_historyRepository.insertHistory(idBill, userID, price);
};

exports.countHistory = () => {
  return orders_historyRepository.countHistory();
};

exports.countHistoryFood = () => {
  return orders_historyRepository.countHistoryFood();
};

exports.getHistory = (userID) => {
  return orders_historyRepository.getHistory(userID);
};

exports.getHistoryFood = (userID) => {
  return orders_historyRepository.getHistoryFood(userID);
};
