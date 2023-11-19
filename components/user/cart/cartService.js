const productService = require("../products_menu/products_menuService");
const profileService = require("../profile/profileService");

exports.add = (productId, cart) => {
  const foundProduct = cart.products.find(
    (product) => product.id === productId
  );
  if (foundProduct) foundProduct.quantity = foundProduct.quantity + 1;
  else {
    cart.products.push({ id: productId, quantity: 1 });
  }
};

exports.edit = (productId, quantity, cart) => {
  const foundProduct = cart.products.find(
    (product) => product.id === productId
  );
  foundProduct.quantity = quantity;
};

exports.remove = (productId, cart) => {
  // if (Object.keys(cart.products).length == 1) {
  //   const foundProduct = cart.products.find(
  //     (product) => product.id === productId
  //   );
  //   if (foundProduct) cart.products = [];
  // } else
  cart.products = cart.products.filter((product) => product.id !== productId);
};

exports.checkOut = (userID, money) => {
  const result = profileService.editBudget(userID, money);
  return result;
};

exports.cartDetails = async (cart) => {
  const cartDetails = { ...cart };
  if (cart === undefined) {
    return {};
  }
  cartDetails.products = await Promise.all(
    cartDetails.products.map(async (product) => {
      const productInfo = await productService.get(product.id);
      return {
        ...product,
        name: productInfo.NAME,
        price: productInfo.PRICE,
        image: productInfo.IMAGE,
      };
    })
  );
  return cartDetails;
};

exports.initCart = () => ({
  products: [],
});
