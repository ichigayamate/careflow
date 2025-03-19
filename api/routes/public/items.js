const {authentication} = require("../../helpers/auth");
const transactionController = require("../../controllers/public/transaction");
const itemsController = require("../../controllers/item");
const router = require("express").Router();

const multer = require("multer");
const ordersController = require("../../controllers/order");
const upload = multer({storage: multer.memoryStorage()});

router.get("/", itemsController.getAllItems);
router.get("/:id", itemsController.getItemById)
router.get("/orders", authentication, ordersController.getUserOrders);
router.post("/buy", authentication, upload.single("file"), transactionController.buyItem);
router.post("/midtrans", authentication, transactionController.generateMidtransToken);

module.exports = router;
