const express = require('express');
const {loginAll, signupAll} = require("../../controllers/auth-controller");
const indexRouter = express.Router();

indexRouter.post('/signin', loginAll)
indexRouter.post('/signup', signupAll)

module.exports = indexRouter