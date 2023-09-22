const { comparePassword } = require("../helpers/bcryptjs")
const { createToken } = require("../helpers/jwt")
const { Customer } = require("../models")

class Controller{
  static async register(req, res, next){
    try {
      let {username, email, password, phoneNumber, imageUrl} = req.body
      const customer = await Customer.create({username, email, password, phoneNumber, imageUrl})
      let data = {
        id: customer.id,
        username: customer.username, 
        email: customer.email,
      }
      res.status (201).json(data)
    } catch (err) {
      console.log(err, "<<< Error registration");
      next(err)
    }
  }

  static async login (req, res, next) {
    try {
      let {email, password} = req.body
      if (!email) {
        throw ({name: "dataEmpty", message: "Email is required!"})
      } 
      if (!password) {
        throw ({name: "dataEmpty", message: "Password is required!"})
      }

      const customer = await Customer.findOne({where: {email}})

      if (!customer) {
        throw ({name: "unauthorize"})
      }

      const validPassword = comparePassword(password, customer.password)
      if (!validPassword) {
        throw ({name: "unauthorize"})
      }
      const payload = {
        id: customer.id
      }
      const access_token = createToken(payload)

      res.status (200).json({
        access_token, username: customer.username, email: customer.email
      })
    } catch (err) {
      console.log(err, "<<< Error login");
      next(err)
    }
  }

  static async showAllCustomer (req, res, next) {
    try{
      const customers = await Customer.findAll({
        attributes: { exclude:['password', 'createdAt', 'updatedAt'] }
      })

      res.status (200).json(customers)
    } catch (err) {
      console.log(err, "<<< Error show all customer");
      next(err)
    }
  }
}
module.exports = Controller