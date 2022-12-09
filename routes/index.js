const express = require('express');
const router = express.Router();
const demoRouter = require('./demo-route/demo-route')

/* GET home page. */
router.get('/demo', demoRouter);

module.exports = router;
