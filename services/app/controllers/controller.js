const { Category, Qurban } = require("../models");
const { Op } = require("sequelize");

class Controller {
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
}

module.exports = Controller;
