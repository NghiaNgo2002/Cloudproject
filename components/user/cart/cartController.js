const cartService = require("./cartService");
const cartApi = require("./api/cart_api");

exports.cart = async (req, res) => {
  res.render("user/cart/cart", { layout: "user_layout" });
};
