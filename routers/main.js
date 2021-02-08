const express = require('express');
const mainController = require('../controller/mainController');

const router = express.Router();

router.use('/', mainController.indexPage);

module.exports = router;