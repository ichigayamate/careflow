const {generateResponse} = require("../views/response-entity");
const {adminOnlyAuth} = require("../helpers/auth");
const ItemController = require("../controllers/item");
const {checkUUID} = require("../helpers/check-uuid");
const genAIcontroller = require("../controllers/public/gen-ai");
const router = require("express").Router();

router.use(adminOnlyAuth);
router.get("/", ItemController.getAllItems);
router.post("/generate-description", genAIcontroller.generateAnswer)
router.post("/", ItemController.createItem);
router.get("/:id", checkUUID, ItemController.getItemById);
router.put("/:id", checkUUID, ItemController.updateItem);
router.patch("/restock/:id", checkUUID, ItemController.restockItem);
router.delete("/:id", checkUUID, ItemController.deleteItem);

module.exports = router;
