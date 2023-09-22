"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = require("../data/categories.json");
    const qurbans = require("../data/qurbans.json");

    categories.forEach((el) => {
      el.createdAt = el.updatedAt = new Date();
    });
    qurbans.forEach((el) => {
      el.createdAt = el.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Categories", categories, {});
    await queryInterface.bulkInsert("Qurbans", qurbans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Qurbans", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
