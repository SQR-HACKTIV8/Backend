const { comparePassword } = require("../helpers/bcryptjs");
const { createToken } = require("../helpers/jwt");
const {
  Category,
  Qurban,
  Customer,
  Notification,
  OrderHistory,
  Order,
  OrderDetail
} = require("../models");
const { Op } = require("sequelize");
const redis = require("../config/redis");

class Controller {
  static async register(req, res, next) {
    try {
      let { username, email, password, phoneNumber, imageUrl } = req.body;
      const customer = await Customer.create({
        username,
        email,
        password,
        phoneNumber,
        imageUrl,
      });
      let data = {
        id: customer.id,
        username: customer.username,
        email: customer.email,
      };
      res.status(201).json(data);
    } catch (err) {
      console.log(err, "<<< Error registration");
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email) {
        throw { name: "dataEmpty", message: "Email is required!" };
      }
      if (!password) {
        throw { name: "dataEmpty", message: "Password is required!" };
      }

      const customer = await Customer.findOne({ where: { email } });

      if (!customer) {
        throw { name: "unauthorize" };
      }

      const validPassword = comparePassword(password, customer.password);
      if (!validPassword) {
        throw { name: "unauthorize" };
      }
      const payload = {
        id: customer.id,
      };
      const access_token = createToken(payload);

      res.status(200).json({
        access_token,
        username: customer.username,
        email: customer.email,
      });
    } catch (err) {
      console.log(err, "<<< Error login");
      next(err);
    }
  }

  static async showAllCustomer(req, res, next) {
    try {
      const customers = await Customer.findAll({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json(customers);
    } catch (err) {
      console.log(err, "<<< Error show all customer");
      next(err);
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

  static async createNotification(req, res, next) {
    try {
      let { title, imageUrl, description } = req.body;
      const notification = await Notification.create({ title, description });
      let data = {
        id: notification.id,
        title: notification.title,
      };
      res.status(201).json(data);
    } catch (err) {
      console.log(err, "<<< Error create notification");
      next(err);
    }
  }

  static async showAllNotification(req, res, next) {
    try {
      const notifications = await Notification.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(200).json(notifications);
    } catch (err) {
      console.log(err, "<<< Error show all notification");
      next(err);
    }
  }

  static async addOrderHistory(req, res, next) {
    try {
      let { title, description, OrderDetailId, imageUrl, videoUrl } = req.body;
      const orderHistory = await OrderHistory.create({
        title,
        description,
        OrderDetailId,
        imageUrl,
        videoUrl,
      });
      let data = {
        id: orderHistory.id,
        title: orderHistory.title,
        OrderDetailId: orderHistory.OrderDetailId,
      };

      await redis.del("sqr_orderHistories");

      res.status(201).json(data);
    } catch (err) {
      console.log(err, "<<< Error add order history");
      next(err);
    }
  }

  static async showAllOrderHistory(req, res, next) {
    try {
      const orderHistoryCache = await redis.get("sqr_orderHistories");

      if (orderHistoryCache) {
        const data = JSON.parse(orderHistoryCache);
        return res.status(200).json(data);
      }
      const orderHistories = await OrderHistory.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      const stringOrderHistories = JSON.stringify(orderHistories);
      await redis.set("sqr_orderHistories", stringOrderHistories);

      res.status(200).json(orderHistories);
    } catch (err) {
      console.log(err, "<<< Error show all order history");
      next(err);
    }
  }

  static async showAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll({
        where : {
          CustomerId: req.customer.id
        }
      });
      res.status(200).json(orders);
    } catch (error) {
      console.log(err, "<<< Error show all orders");
      next(err);
    }
  }

  static async addOrder(req, res, next) {
    try {
      let data = req.body;
      // data = [
      //   {
      //     QurbanId: 5,
      //     treeType: "Acacia",
      //     onBehalfOf: "Sinta, Dewi, Agus, Rizky"
      //   },
      //   {
      //     QurbanId: 6,
      //     treeType: "Pine",
      //     onBehalfOf: "Alm. Rudi bin Ridho, Alm. Sita binti Rizky"
      //   }
      // ] //data dummy for testing
      const date = new Date().toISOString().split("-").join("").split(":").join("").split(".").join("")
      const OrderId = "SQR" + date + Math.floor(1000 + Math.random() * 1000)
      let reforestationData = []
      let qurbanId = []
      data.map(el => {
        reforestationData.push({
          treeType: el.treeType,
          quantity: 1,
          createdAt : new Date(),
          updatedAt : new Date()
        })
        qurbanId.push (el.QurbanId)
        delete el.treeType
        el.OrderId = OrderId
        el.createdAt = el.updatedAt = new Date()
        return el
      })

      if (!qurbanId[0]){
        throw ({name: "notFound", message: "Qurban is required!"})
      }

      const newOrder = await Order.create({
        CustomerId: req.customer.id,
        totalPrice: 0,
        totalQuantity: data.length,
        OrderId,
      });

      const addOrderDetails = await OrderDetail.bulkCreate(data)
      const orderDetails = await OrderDetail.findAll({
        include: {
          model: Qurban,
          attributes: ['price']
        },
        where: {
          OrderId
        },
        attributes:['id']
      });
      
      let orderDetailsId = []
      let totalPrice = 0
      orderDetails.forEach(el => {
        console.log(el.dataValues, "<<< ini find All")
        orderDetailsId.push(el.dataValues.id)
        totalPrice += el.dataValues.Qurban.dataValues.price  
      });

      reforestationData.map((el, i) => {
        orderDetailsId.forEach((e, y) => {
          if (i === y){
            el.OrderDetailId = e
          }
        })
        return el
      })
      const order = await Order.update ({totalPrice},{
        where: {OrderId}
      })
      const findNewOrder = await Order.findOne ({
        where: {OrderId}
      })
      console.log(findNewOrder, OrderId,"<<", qurbanId, "<<<<<<<<")
      await Qurban.update({ isBooked: true }, {
        where: {
          id: qurbanId
        }
      });

      res.status(201).json({
        message: `Order with id ${newOrder.id} has been created`,
        findNewOrder,
      });
    } catch (error) {
      console.log(error, "<<< Error add order");
      next(error);
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);

      if (!order) {
        throw { name: "orderNotFound" };
      }

      await Order.destroy({ where: { id: orderId } });

      await Qurban.update(
        { isBooked: false },
        { where: { id: order.OrderId } }
      );

      res.status(200).json({
        message: `Order with id ${orderId} deleted succesfully.`,
      });
    } catch (error) {
      console.log(err, "<<< Error delete order");
      next(err);
    }
  }

  static async showDetailOrder(req, res, next) {
    try {
      const {id} = req.params
      const order = await Order.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: {
          id,
          CustomerId: req.customer.id
        }
      });
      if (!order){
        throw ({name: "notFound", message: "Order not found!"})
      }
      const OrderId = order.dataValues.OrderId
      const orderDetails = await OrderDetail.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: {
          OrderId
        }
      })
      res.status(200).json({order, orderDetails});
    } catch (error) {
      console.log(error, "<<< Error show detail from order");
      next(error);
    }
  }
}
module.exports = Controller;
