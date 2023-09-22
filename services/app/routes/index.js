const express = require("express");
const router = express().Router;
const Controller = require("../controllers/controller");
const errorHandler = require("../middlewares/errorhandler");

router.get("/", (req, res) => {
  res.send("Hello from App-services!");
});

router.get("/categories", Controller.showAllCategories);
router.post("/categories", Controller.addCategory);

router.get("/qurbans", Controller.showAllQurbans);
router.get("/qurbans", Controller.showAllQurbans);
router.post("/qurbans", Controller.addQurban);
router.get("/qurbans/:id", Controller.showDetailQurban);
router.patch("/qurbans/:id", Controller.updateQurban);

router.use(errorHandler);

module.exports = router;
