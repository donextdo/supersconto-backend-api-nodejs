const passport = require('passport');
const Roles = require("../../models/constants/roles");
const CustomerModel = require('../../models/customer')
const AdminModel = require('../../models/admin')
const VendorModel = require('../../models/vendor')
const localStrategy = require('passport-local').Strategy;

passport.use(
    'signup',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                const userData = req.body

                let user

                if (userData.userType === Roles.ADMIN) {
                    user = await AdminModel.create(userData);
                } else if (userData.userType === Roles.VENDOR) {
                    user = await VendorModel.create(userData);
                } else if (userData.userType === Roles.CUSTOMER) {
                    user = await CustomerModel.create(userData);
                }
                return done(null, user);

            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                let user
                if (req.body.role === Roles.ADMIN) {
                    user = await AdminModel.findOne({email});
                    if (!user) {
                        return done(null, false, {message: 'User not found'});
                    }

                } else if (req.body.role === Roles.VENDOR) {
                    user = await VendorModel.findOne({email})
                    if (!user) {
                        return done(null, false, {message: 'User not found'});
                    }

                } else if (req.body.role === Roles.CUSTOMER) {
                    user = await CustomerModel.findOne({email})
                    if (!user) {
                        return done(null, false, {message: 'User not found'});
                    }
                }
                else {
                    return done(null, false, {message: 'Invalid user type'});
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {message: 'Wrong Password'});
                }

                return done(null, user, {message: 'Logged in Successfully'});
            } catch (error) {
                return done(error);
            }
        }
    )
);
