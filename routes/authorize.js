var express = require('express');
var router = express.Router();

const authorizeController = require('./authorizeController');

router.get("/user", authorizeController.user);
router.get("/admin", authorizeController.admin);
router.get("/none", authorizeController.none);

module.exports = router;