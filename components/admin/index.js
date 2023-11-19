const express = require("express");
const router = express.Router();

const upload = require('../../middleware/upload');

const edit_accounts = require("./edit_accounts/accountsController");
const edit_products = require("./edit_products/edit_productsController");
const profile = require("./profile/profileController");
const statistic = require("./statistic/statisticController");
const register = require("./register/registerController");
const list_orders = require("./list_orders/list_ordersController");

router.get("/", profile.profileRedirect);
router.get("/edit_accounts", edit_accounts.account);
router.get("/edit_products", edit_products.product);
router.get("/list_orders", list_orders.order);

router.get("/profile", profile.profile);
router.post("/profile/information", profile.editProfile);
router.post("/profile/password", profile.changePassword);
router.post("/profile/image", upload.single('image'), profile.editAvatar);
router.get("/profile/remove-image", profile.removeAvatar);
router.get('/signout', profile.signout);

router.get("/statistic", statistic.statistic);
router.post("/statistic/value", statistic.statisticData);
router.get("/register", register.register);

//add
router.get("/edit_accounts/add",edit_accounts.add);
router.post('/edit_accounts/add', edit_accounts.saveAdd);
router.get("/edit_products/add",edit_products.add);
router.post('/edit_products/add', upload.single('image'), edit_products.saveAdd);
//edit
router.get("/edit_accounts/:id", edit_accounts.details);
router.get("/edit_products/:id", edit_products.details);
router.get("/edit_orders/:id", list_orders.details);
// del
router.post("/edit_products/del/:id",edit_products.delete);
router.post("/edit_orders/:id/del", list_orders.delete);
router.get("/edit_products/remove-image/:id",edit_products.removeImage);
//update
router.post("/edit_accounts/patch", edit_accounts.saveEdit);
router.post("/edit_products/patch",upload.single('image'), edit_products.saveEdit);
router.post("/edit_products/saveImage", upload.single('image'), edit_products.saveEdit);
router.post("/edit_orders/:id/patch", list_orders.saveEdit);
//lock and unlock
router.post("/edit_accounts/lock", edit_accounts.setLock);
router.post("/edit_accounts/unlock", edit_accounts.setUnLock);



//API
router.post("/api/edit_accounts/active", edit_accounts.getActive);
router.post("/api/edit_accounts", edit_accounts.paginator);

router.post("/api/edit_products/category", edit_products.getCategory);
router.post("/api/edit_products", edit_products.paginator);

router.post("/api/statistic/top_products", statistic.topProductsData);
router.post("/api/statistic/month", statistic.statisticDataByMonth);

router.post("/api/list_orders", list_orders.paginator);
module.exports = router;
