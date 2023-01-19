const Roles = require("../models/constants/roles");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const loginAll = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                   return res.status(401).send(info?.message)
                }
                req.login(
                    user,
                    {session: false},
                    async (error) => {
                        if (error) {
                            return res.status(500).json({message: 'error login user'})
                        }
                        const {password, ...userData} = user._doc

                        const body = {_id: user._id, email: userData.email, roles: [userData.userType]};
                        const token = jwt.sign({user: body}, 'TOP_SECRET', {expiresIn: '7d'});

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

module.exports = {loginAll, signupAll}