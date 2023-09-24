const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SIGNITURE_KEY

const verifyToken = (token) => jwt.verify(token, SECRET_KEY)
const createToken = (payload) => jwt.sign(payload, SECRET_KEY) 

function createTokenPdf() {
  const options = {
    algorithm: "HS256",
  };
  const payload = {
    iss: process.env.PDF_API_KEY,
    sub: process.env.PDF_EMAIL,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const API_SECRET = process.env.PDF_API_SECRET;

  const token = jwt.sign(payload, API_SECRET, options);

  return token;
}


module.exports = {verifyToken, createToken, createTokenPdf}