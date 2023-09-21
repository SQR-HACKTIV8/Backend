const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SIGNITURE_KEY

const createToken = (payload) => jwt.sign(payload, SECRET_KEY) 

module.exports = {createToken}