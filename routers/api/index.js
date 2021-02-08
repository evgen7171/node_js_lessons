const express = require('express');
const cors = require('cors');
const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

const router = express.Router();

productApiRouter = require('./product.js');

router.options('/v1/product', cors(corsOptions));
router.use('/v1/product', cors(corsOptions), productApiRouter);
