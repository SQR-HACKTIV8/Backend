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

  static async showAllNotification(req, res, next) {
    try{
      const notifications = await Notification.findAll({
        attributes: { exclude:['createdAt', 'updatedAt'] }
      })

      res.status (200).json(notifications)
    } catch (err) {
      console.log(err, "<<< Error show all notification");
      next(err)
    }
  }
}

module.exports = Controller