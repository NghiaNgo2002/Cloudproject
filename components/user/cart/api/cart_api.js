const cartService = require("../cartService");
const productsService = require("../../products/productsService");
const orders_historyService = require("../../orders_history/orders_historyService");

exports.add = async (req, res) => {
  const { productID: productId } = req.body;
  // validate valid productId
  // ...
  const product = await productsService.get(productId);
  if (product == null) {
  } else {
    if (!req.session.cart) req.session.cart = cartService.initCart();
    cartService.add(productId, req.session.cart);
    res.json(req.session.cart);
  }
};

exports.edit = async (req, res) => {
  const { productID: productId } = req.body;
  const { quantity: quantity } = req.body;
  cartService.edit(productId, quantity, req.session.cart);
  res.json(req.session.cart);
};

exports.remove = async (req, res) => {
  const { productID: productId } = req.body;
  cartService.remove(productId, req.session.cart);
  res.json(req.session.cart);
};

exports.cartDetail = async (req, res) => {
  res.json(await cartService.cartDetails(req.session.cart));
};

exports.getBudget = async (req, res) => {
  res.json(req.user);
};

exports.removeAll = async (req, res) => {
  req.session.cart = cartService.initCart();
  res.json(req.session.cart);
};

exports.checkOut = async (req, res) => {
  const { remainBudget: money } = req.body;
  const { userID: userID } = req.body;
  const { note: note } = req.body;
  let idFoodBill = parseInt(await orders_historyService.countHistoryFood());
  const user = await cartService.checkOut(userID, money);
  const curCart = await cartService.cartDetails(req.session.cart);

  idFoodBill += 1;
  Object.values(curCart.products).forEach((value) => {
    console.log(idFoodBill, value, userID, note);
    orders_historyService.insertHistoryFood(idFoodBill, value, userID, note);
  });
  req.user = user;
  res.json(user);
};

exports.reqBudget = async (req, res) => {
  const { addBudget: money } = req.body;
  const userID = Object.values(req.user)[0];
  const idBill = parseInt(await orders_historyService.countHistory());

  console.log(idBill, money, userID);

  const user = await orders_historyService.insertHistory(
    idBill + 1,
    userID,
    money
  );

  req.user = user;
  res.json(user);
};

// exports.addBudget = async (req, res) => {
//   const { addBudget: money } = req.body;
//   const userID = Object.values(req.user)[0];

//   const user = await cartService.checkOut(userID, money);

//   req.user = user;
//   res.json(user);
// };
