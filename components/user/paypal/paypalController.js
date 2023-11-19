const paypal = require("./paypalService");
const reload_api = require("../profile/profileController");

exports.showPaypal = (req, res) => {
    res.render("user/topup/topup", { layout: "user_layout" });
}

exports.changeAmount = (req, res) => {
    const { addBudget:addBudget } = req.body;
    paypal.changeAmount(addBudget);
}

exports.orders = async (req, res) => {
    const order = await paypal.createOrder();
    res.json(order);
}

exports.capture = async (req, res) => {
    const { orderID } = req.params;
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
}

exports.complete = async (req, res) => {
    const result = await paypal.complete(req.user.ID);
    if(result){
        reload_api.reload(req, res);
    }
}