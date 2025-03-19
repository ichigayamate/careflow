const {generateResponse} = require("../views/response-entity");
const CategoriesController = require("../controllers/categories");
const {checkUUID} = require("../helpers/check-uuid");
const router = require("express").Router();

router.get("/", CategoriesController.getAllCategories);
router.get("/:id", checkUUID, CategoriesController.getCategoryById);
router.post("/", CategoriesController.createCategory);
router.put("/:id", checkUUID, CategoriesController.updateCategoryById);
router.delete("/:id", checkUUID, CategoriesController.deleteCategoryById);

module.exports = router;
