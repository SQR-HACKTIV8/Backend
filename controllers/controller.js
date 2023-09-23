const { comparePassword } = require("../helpers/bcryptjs")
const { createToken } = require("../helpers/jwt")
const { Category, Qurban, Customer, Notification, OrderHistory, ReforestationDonation } = require("../models");
const { Op } = require("sequelize");
const redis = require("../config/redis")

class Controller {
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

  static async showAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { name } = req.body;

      const newCategory = await Category.create({
        name,
      });

      res.status(201).json({
        message: `Category with id ${newCategory.id} has been created`,
        newCategory,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async showAllQurbans(req, res, next) {
    try {
      let { filter, search } = req.query;

      search = search || "";

      let obj = {
        include: [Category],
        order: [["id", "ASC"]],
        where: {
          name: { [Op.iLike]: `%${search}%` },
        },
      };

      if (filter) {
        obj.where.categoryId = filter;
      }

      console.log(obj, "<<<");

      const qurbans = await Qurban.findAll(obj);

      res.status(200).json(qurbans);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async showDetailQurban(req, res, next) {
    try {
      const { id } = req.params;

      const qurban = await Qurban.findByPk(id, {
        include: [Category],
      });

      if (!qurban) {
        throw { name: "qurbanNotFound" };
      }

      res.status(200).json(qurban);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addQurban(req, res, next) {
    try {
      const {
        name,
        CategoryId,
        price,
        quality,
        description,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        videoUrl,
        weight,
      } = req.body;

      const category = await Category.findByPk(CategoryId);

      if (!category) {
        throw { name: "categoryNotFound", error: "Category not found" };
      }

      const newQurban = await Qurban.create({
        name,
        CategoryId,
        price,
        quality,
        description,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        videoUrl,
        weight,
        isBooked: false,
      });

      res.status(201).json({
        message: `Qurban with id ${newQurban.id} has been created`,
        newQurban,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateQurban(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        CategoryId,
        price,
        quality,
        description,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        videoUrl,
        weight,
        isBooked,
      } = req.body;

      const qurban = await Qurban.findByPk(id);

      if (!qurban) {
        throw { name: "qurbanNotFound" };
      }

      let updatedQurban = await Qurban.update(
        {
          name,
          CategoryId,
          price,
          quality,
          description,
          imageUrl1,
          imageUrl2,
          imageUrl3,
          videoUrl,
          weight,
          isBooked,
        },
        {
          where: { id },
        }
      );

      res
        .status(200)
        .json({ message: "Qurban updated successfully", updatedQurban });
    } catch (error) {
      console.log(error);
      next(error); // 404 & 403
    }
  }
  
  static async createNotification(req, res, next){
    try {
      let {title, imageUrl, description} = req.body
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

  static async showAllReforestationDonation(req, res, next) {
    try{
      const reforestationDonations = await ReforestationDonation.findAll({
        attributes: { exclude:['createdAt', 'updatedAt'] }
      })

      res.status (200).json(reforestationDonations)
    } catch (err) {
      console.log(err, "<<< Error show all reforestation donation");
      next(err)
    }
  }
  
  static async addOrderHistory (req, res, next){
    try {
      let {title, description, OrderDetailId, imageUrl, videoUrl} = req.body
      const orderHistory = await OrderHistory.create({title, description, OrderDetailId, imageUrl, videoUrl})
      let data = {
        id: orderHistory.id,
        title: orderHistory.title, 
        OrderDetailId: orderHistory.OrderDetailId,
      }

      await redis.del("sqr_orderHistories");

      res.status (201).json(data)
    } catch (err) {
      console.log(err, "<<< Error add order history");
      next(err)
    }
  }

  static async showAllOrderHistory(req, res, next) {
    try{
      const orderHistoryCache = await redis.get("sqr_orderHistories")
   
      if (orderHistoryCache){
        const data = JSON.parse(orderHistoryCache)
        return res.status (200).json(data)
      }
      const orderHistories = await OrderHistory.findAll({
        attributes: { exclude:['createdAt', 'updatedAt'] }
      })
      const stringOrderHistories = JSON.stringify(orderHistories)
      await redis.set("sqr_orderHistories", stringOrderHistories)

      res.status (200).json(orderHistories)
    } catch (err) {
      console.log(err, "<<< Error show all order history");
      next(err)
    }
  }
}
module.exports = Controller;

