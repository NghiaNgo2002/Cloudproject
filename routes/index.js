var express = require('express');
var router = express.Router();

const indexController = require("./indexController");

router.get('/', indexController.auth);

module.exports = router;
