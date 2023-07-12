const Roles = require("../models/constants/roles");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {createToken} = require('../utils/token')
const auth = require("jsonwebtoken");

const loginAll = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(401).json({message: info?.message,})
                }
                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) {
                            return res.status(500).json({message: 'error login user'})
                        }
                        const {password, ...userData} = user._doc

                        const body = {_id: user._id, email: userData.email, role: userData.userType};
                        const token = createToken(body)

                        return res.json({token, user: userData});
                    }
                );
            } catch (error) {
                return res.status(401).json({message: 'error login user'})
            }
        }
    )(req, res, next);
}

const signupAll = async (req, res, next) => {
    passport.authenticate('signup', {session: false}, function (err, user, info) {

        if (err || !user) {
            console.log(err)
            console.log(user)
            if (err?.code && err?.code === 11000) {
                return res.status(400).json({
                    isRegistered: false,
                    duplicate: Object.keys(err.keyValue),
                    message: `Duplicate value entered for ${Object.keys(
                        err.keyValue
                    )} field, please choose another value`
                })
            }

            return res.status(500).json({
                isRegistered: false,
                message: 'Unable to register your account, Already have a account? try login',
                info
            });
        }
        const {password, ...userInfo} = user.toObject()
        return res.json({
            isRegistered: true,
            userInfo
        })


    })(req, res, next);

}

const getAuthUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "Please login"
            })
        }

        res.status(200).json(req.user)

    } catch (error) {
        res.status(500).json(error.message)
    }
}

const socialLoginAll = async (req, res, next) => {
    try {
        const {email, fullName, picture, role} = req.body

        const user = await User.findOne({email}).select("-password").lean();
        if (user) {
            const token = auth.sign({_id: user.id}, 'myprivatekey');
            return res.status(200).send({...user, token});
        } else {
            const nameArr = fullName.split(" ")

            let registeredUser = await User.create({
                email,
                firstName: nameArr[0],
                lastName: nameArr[nameArr.length],
            });

            if (registeredUser) {
                const token = auth.sign({_id: registeredUser.id}, 'myprivatekey');
                return res.status(200).send({...registeredUser._doc, token});
            }

        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: "Internal server error"});
    }
}

module.exports = {loginAll, signupAll, getAuthUser, socialLoginAll}