const passport = require('passport');
const Roles = require("../../models/constants/roles");
const User = require('../../models/user')
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
                    user = await User.create(userData);
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
                console.log(email,password)
                let user
                if (req.body.role === Roles.ADMIN) {
                    user = await AdminModel.findOne({email});
                    if (!user) {
                        return done(null, false, {message: 'User not found', status: 404});
                    }

                } else if (req.body.role === Roles.VENDOR) {
                    user = await VendorModel.findOne({email})
                    if (!user) {
                        return done(null, false, {message: 'User not found', status: 404});
                    }

                } else if (req.body.role === Roles.CUSTOMER) {
                    user = await User.findOne({email})
                    if (!user) {
                        return done(null, false, {message: 'User not found', status: 404});
                    }
                }
                else {
                    return done(null, false, {message: 'Invalid user type', status: 400});
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {message: 'Wrong Password', status: 401});
                }

                return done(null, user, {message: 'Logged in Successfully', status: 200});
            } catch (error) {
                return done(error);
            }
        }
    )
);
