const { verifyToken } = require('../utils/token')
const Customer = require('../models/customer')
const Admin = require('../models/admin')
const Vendor = require('../models/vendor')
const roles = require('../models/constants/roles')
const jwt = require('jsonwebtoken')

const AuthenticatedMiddleware = async (req, res, next) => {
    const bearer = req.headers.authorization

    if(!bearer || !bearer?.startsWith('Bearer ')) {
        return res.status(401).send('You are not authenticated!')
    }

    const accessToken = bearer?.split('Bearer ')[1].trim();

    try {
        const payload = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(403).send('Token is not valid!');
        }


        let user

        if(payload.user.role === roles.ADMIN){
            user = await Admin.findById(payload.user._id)
        }
        else if(payload.user.role === roles.VENDOR){
            user = await Vendor.findById(payload.user._id)
        }
        else {
            user = await Customer.findById(payload.user._id)
        }

        if (!user) {
            return res.status(404).json({
                message: 'No user found'
            });
        }

        const {password, ...userInfo} = user._doc

        req.user = userInfo;

        return next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
        
    }

}


const AuthenticatedCustomerMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {

        if(req.user._id.toString() === req.params.id || req.user.userType === roles.ADMIN) {
            next()
        }
        else {
            return res.status(403).send('You are not allowed')
        }
    })
}


const AuthenticatedVendorMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {
        if(req.user.userType === roles.VENDOR || req.user.userType === roles.ADMIN) {
            next()
        }
        else {
            return res.status(403).json({
                message: 'You are not allowed'
            })
        }
    })
}


const AuthenticatedAdminMiddleware = async (req, res, next) => {
    AuthenticatedMiddleware(req, res, () => {
        if(req.user.userType === roles.ADMIN) {
            next()
        }
        else {
            return res.status(403).send('You are not allowed')
        }
    })
}


module.exports = {
    AuthenticatedMiddleware,
    AuthenticatedCustomerMiddleware,
    AuthenticatedVendorMiddleware,
    AuthenticatedAdminMiddleware
}