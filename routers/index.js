const express = require('express');
const router = express.Router();

const mainRouter = require('./main.js');
// const apiRouter = require('./api');

// router.use('/api/', apiRouter);
router.use(mainRouter);

module.exports = router;
