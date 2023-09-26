const router = require("express").Router();
const Controller = require("../controllers/controller");
const { authentication } = require("../middlewares/authentication");

router.get("/", (req, res) => {
  res.send("Hello SQR Fam!");
});

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.get("/customers", Controller.showAllCustomer); //for debug

router.get("/categories", Controller.showAllCategories);
router.post("/categories", Controller.addCategory); // admin

router.post("/notifications", Controller.createNotification); // admin

// router.get("/reforestation-donations", Controller.showAllReforestationDonation); // admin

router.get("/qurbans", Controller.showAllQurbans);
router.get("/qurbans/:id", Controller.showDetailQurban);

// router.post("/qurbans", Controller.addQurban); //admin
// router.put("/qurbans/:id", Controller.updateQurban); //admin

// router.post("/order_histories", Controller.addOrderHistory); // admin
// router.get("/order_histories", Controller.showAllOrderHistory); // admin

router.post("/payment-notification", Controller.paymentNotification)

router.use(authentication);

router.get("/notifications", Controller.showAllNotification);

router.get("/orders", Controller.showAllOrders);
router.post("/orders", Controller.addOrder);
router.delete("/orders/:id", Controller.deleteOrder);
router.get("/orders/:id", Controller.showDetailOrder);

router.post("/token-midtrans", Controller.generateTokenMidtarns);

module.exports = router;
