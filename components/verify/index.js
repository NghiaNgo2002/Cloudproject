const express = require("express");
const router = express.Router();

const verifyController = require('./verifyController');

router.get('/', verifyController.showAccount);
router.get('/account', verifyController.emailAccount);
router.get('/password', verifyController.emailPassword);
router.get('/verifyAccount', verifyController.verifyAccount);
router.get('/verifyPassword', verifyController.verifyPassword);
router.post('/verifyPassword', verifyController.resetPassword);

module.exports = router;