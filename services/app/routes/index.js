const router = require('express').Router()
const Controller = require("../controllers/controller");
const { authentication } = require('../middlewares/authentication')

router.get("/", (req, res) => {
  res.send("Hello from App-services!");
});

router.get("/categories", Controller.showAllCategories);
router.post("/categories", Controller.addCategory);

router.get("/qurbans", Controller.showAllQurbans);
router.get("/qurbans", Controller.showAllQurbans);

router.use(authentication)

router.post("/qurbans", Controller.addQurban);
router.get("/qurbans/:id", Controller.showDetailQurban);
router.patch("/qurbans/:id", Controller.updateQurban);

module.exports = router;