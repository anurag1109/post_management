const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    const token = req.headers.authorization
    if (token) {
        jwt.verify(token, "key", (err, decoded) => {
            if (decoded) {
                req.body.user = decoded.userId
                next()
            } else {
                res.status(200).send("please login first")
            }
        })
    } else {
        res.status(200).send("please login first")
    }
}
module.exports={authentication}