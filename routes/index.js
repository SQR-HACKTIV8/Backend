const router = require('express').Router()
const Controller = require("../controllers/controller");
const { authentication } = require('../middlewares/authentication')

router.get("/", (req, res) => {
  res.send("Hello SQR Fam!");
});

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.get('/customers', Controller.showAllCustomer) //for debug

router.get("/categories", Controller.showAllCategories);
router.post("/categories", Controller.addCategory);

router.post('/notifications', Controller.createNotification) // admin
router.get('/notifications', Controller.showAllNotification) 

router.get("/qurbans", Controller.showAllQurbans);
router.get("/qurbans/:id", Controller.showDetailQurban);

router.use(authentication)

router.post("/qurbans", Controller.addQurban);
router.patch("/qurbans/:id", Controller.updateQurban);

module.exports = router;