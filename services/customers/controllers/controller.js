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
}
module.exports = Controller