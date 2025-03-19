const {adminOnlyAuth, adminOrSelfAuth} = require("../helpers/auth");
const orderController = require("../controllers/order");
const router = require("express").Router();

router.get("/", adminOnlyAuth, orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.delete("/:id", adminOnlyAuth, orderController.deleteOrderById);

module.exports = router;
