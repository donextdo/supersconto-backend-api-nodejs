const express = require('express');
const {loginAll, signupAll, getAuthUser,socialLoginAll,forgetPassword, verifyPassword, updatePassword} = require("../../controllers/auth-controller");
const indexRouter = express.Router();
const {
    AuthenticatedMiddleware
} = require('../../middleware/authentication')

indexRouter.post('/signin', loginAll)
indexRouter.post('/signup', signupAll)
indexRouter.post('/social', socialLoginAll)
indexRouter.get('/user', AuthenticatedMiddleware, getAuthUser)
indexRouter.post("/forget-password", forgetPassword)
indexRouter.post("/verify-password", verifyPassword)
indexRouter.post("/update-password", updatePassword)



module.exports = indexRouter