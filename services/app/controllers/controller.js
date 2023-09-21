const { Notification } = require("../models")

class Controller {
  static async createNotification(req, res, next){
    try {
      let {title, description} = req.body
      const notification = await Notification.create({title, description})
      let data = {
        id: notification.id,
        title: notification.title
      }
      res.status (201).json(data)
    } catch (err) {
      console.log(err, "<<< Error create notification");
      next(err)
    }
  }
}

module.exports = Controller