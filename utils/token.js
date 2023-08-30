const jwt = require('jsonwebtoken')

const createToken = (payload) => {
    return jwt.sign(
        {user: payload},
        process.env.JWT_SECRET,
        {expiresIn: '4h'}
    )
}

const verifyToken = async (
    token
) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, payload) => {
                if(err) return reject(err)

                resolve(payload)
            }
        )
    })
}

module.exports = { createToken, verifyToken }