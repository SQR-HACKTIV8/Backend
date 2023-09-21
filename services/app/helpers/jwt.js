const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SIGNITURE_KEY

const verifyToken = (token) => jwt.verify(token, SECRET_KEY)

module.exports = {verifyToken}