const { comparePassword } = require("../helpers/bcryptjs")
const { createToken } = require("../helpers/jwt")
const { Category, Qurban, Customer, Notification, OrderHistory, Order, OrderDetail, ReforestationDonation } = require("../models");
const { Op } = require("sequelize");
const redis = require("../config/redis");
const midtransClient = require("midtrans-client");

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
      const categoriesCache = await redis.get("sqr_categories");

      if (categoriesCache) {
        const data = JSON.parse(categoriesCache);
        return res.status(200).json(data);
      }
      const categories = await Category.findAll();

      const stringCategories = JSON.stringify(categories);
      await redis.set("sqr_categories", stringCategories);

      res.status(200).json(categories);
    } catch (error) {
      console.log(error, "<<< Error show all category");
      next(error);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { name } = req.body;

      const newCategory = await Category.create({
        name,
      });

      await redis.del("sqr_categories");

      res.status(201).json({
        message: `Category with id ${newCategory.id} has been created`,
        newCategory,
      });
    } catch (error) {
      console.log(error, "<<< Error add category");
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
      console.log(error, "<<< Error show all qurban");
      next(error);
    }
  }

  static async showDetailQurban(req, res, next) {
    try {
      const { id } = req.params;

      const qurban = await Qurban.findByPk(id, {
        include: [Category],
      });

      if (!qurban){
        throw ({name: "notFound", message: "Qurban not found!"})
      }

      res.status(200).json(qurban);
    } catch (error) {
      console.log(error, "<<< Error show qurban by id");
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

      if (!category){
        throw ({name: "notFound", message: "Category not found!"})
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
      console.log(error, "<<< Error add qurban");
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

      if (!qurban){
        throw ({name: "notFound", message: "Qurban not found!"})
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
      console.log(error, "<<< Error update qurban detail by id");
      next(error);
    }
  }

  static async createNotification(req, res, next) {
    try {
      let { title, imageUrl, description } = req.body;
      const notification = await Notification.create({ title, imageUrl, description });
      let data = {
        id: notification.id,
        title: notification.title,
      };
      await redis.del("sqr_notifcations");
      res.status(201).json(data);
    } catch (err) {
      console.log(err, "<<< Error create notification");
      next(err);
    }
  }

  static async showAllNotification(req, res, next) {
    try {
      const notificationsCache = await redis.get("sqr_notifcations");

      if (notificationsCache) {
        const data = JSON.parse(notificationsCache);
        return res.status(200).json(data);
      }
      const notifications = await Notification.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      const stringNotifications = JSON.stringify(notifications);
      await redis.set("sqr_notifications", stringNotifications);

      res.status(200).json(notifications);
    } catch (err) {
      console.log(err, "<<< Error show all notification");
      next(err);
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
      const orderCache = await redis.get("sqr_orders");

      if (orderCache) {
        const data = JSON.parse(orderCache);
        return res.status(200).json(data);
      }

      const orders = await Order.findAll({
        where : {
          CustomerId: req.customer.id
        }
      });

      const stringOrders = JSON.stringify(orders);
      await redis.set("sqr_orders", stringOrders);

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
      //     QurbanId: 19,
      //     treeType: "Acacia",
      //     onBehalfOf: "Sinta, Dewi, Agus, Rizky"
      //   },
      //   {
      //     QurbanId: 20,
      //     treeType: "Pine",
      //     onBehalfOf: "Alm. Rudi bin Ridho, Alm. Sita binti Rizky"
      //   }
      // ] //data dummy for testing
      const date = new Date().toISOString().split("-").join("").split(":").join("").split(".").join("")
      const OrderId = "SQR" + date + Math.floor(1000 + Math.random() * 1000)
      let reforestationData = []
      let qurbansId = []
      data.map(el => {
        reforestationData.push({
          treeType: el.treeType,
          quantity: 1,
          createdAt : new Date(),
          updatedAt : new Date()
        })
        qurbansId.push (el.QurbanId)
        delete el.treeType
        el.OrderId = OrderId
        el.createdAt = el.updatedAt = new Date()
        return el
      })

      if (!qurbansId[0]){
        throw ({name: "notFound", message: "Qurban is required!"})
      }

      const newOrder = await Order.create({
        CustomerId: req.customer.id,
        totalPrice: 0,
        totalQuantity: data.length,
        OrderId,
      });

      await OrderDetail.bulkCreate(data)
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
      await Order.update ({totalPrice},{
        where: {OrderId}
      })

      const findNewOrder = await Order.findOne ({
        where: {OrderId}
      })

      await Qurban.update({ isBooked: true }, {
        where: {
          id: qurbansId
        }
      });

      await OrderHistory.create({
        title: "New Order", 
        description: `Created new order with id ${OrderId}. Status payment is pending`, 
        OrderDetailId: orderDetailsId[0]
      })

      await redis.del("sqr_orders");
      await redis.del("sqr_orderHistories");
      
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
      const order = await Order.findOne({
        where: {
          id: orderId,
          CustomerId: req.customer.id
        }
      });

      if (!order){
        throw ({name: "notFound", message: "Order not found!"})
      }

      const orderDetails = await OrderDetail.findAll({
        where: {
          OrderId: order.OrderId,
        }
      })
      const sampleOrderDetailId = orderDetails[0].dataValues.id
      const qurbansId = orderDetails.map(el => {
        return el.QurbanId
      })

      await Order.destroy({ where: { id: orderId } });
      await OrderHistory.create({
        title: "Order Cancel", 
        description: `Order with id ${order.OrderId} has been canceled`, 
        OrderDetailId: sampleOrderDetailId
      })
      await Qurban.update(
        { isBooked: false },
        { where: { id: qurbansId } }
      )

      await redis.del("sqr_orders");
      await redis.del("sqr_orderHistories");

      res.status(200).json({
        message: `Order with id ${order.OrderId} canceled succesfully.`,
      });
    } catch (error) {
      console.log(error, "<<< Error delete order");
      next(error);
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
        },
      });
      if (!order){
        throw ({name: "notFound", message: "Order not found!"})
      }
      const OrderId = order.dataValues.OrderId
      const orderDetails = await OrderDetail.findAll({
        include: {
          model: Qurban,
          attributes: ['price']
        },
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

  static async generateTokenMidtarns(req, res, next){
    try {
      const {OrderId, totalPrice} = req.body
      const findOrder = await Order.findOne({
        where: {
          OrderId
        }
      })
      console.log(findOrder.dataValues)
      if (findOrder.statusPayment){
        throw ({name: 'found', message: `Order with id ${OrderId} already paid`})
      }
      let snap = new midtransClient.Snap({
              isProduction : false,
              serverKey : process.env.MIDTRANS_KEY
          });

      let parameter = {
          "transaction_details": {
              "order_id": OrderId,
              "gross_amount": totalPrice
          },
          "credit_card":{
              "secure" : true
          },
          "customer_details": {
              "email": req.customer.email,
          }
      };

      const midtrans_token = await snap.createTransaction(parameter)
      res.status(201).json(midtrans_token)

    } catch (error) {
      console.log(error, "<<< Error generate midtrans token");
      next(error)
    }
  }
}
module.exports = Controller;
