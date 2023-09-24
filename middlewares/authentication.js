const { Customer } = require('../models')
const { verifyToken } = require('../helpers/jwt')

async function authentication (req, res, next) {
  try {
    const {access_token} = req.headers
    if (!access_token){
      throw ({name: "unauthenticated"})
    }
    const payload = verifyToken(access_token)

    const findCustomer = await Customer.findByPk(payload.id)
    if (!findCustomer){
      throw ({name: "unauthenticated"})
    }

    req.customer = {
      id: findCustomer.id,
      email: findCustomer.email,
      username: findCustomer.username
    }
    next()
  } catch(err){
    console.log(err, "<<< Error authentication");
    next(err)
  }
}

module.exports = { authentication }