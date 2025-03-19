const {Category} = require('../models');
const {generateResponse} = require("../views/response-entity");
const {NotFoundError} = require("../helpers/error");

module.exports = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        include: 'Items'
      });
      generateResponse(res, categories)
    } catch (error) {
      next(error);
    }
  },
  getCategoryById: async (req, res, next) => {
    const {id} = req.params;
    try {
      const category = await Category.findByPk(id, {
        include: 'Items'
      });
      generateResponse(res, category)
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req, res, next) => {
    const body = req.body;
    try {
      const category = await Category.create(body);
      generateResponse(res, category, 201, "Created");
    } catch (error) {
      next(error);
    }
  },
  updateCategoryById: async (req, res, next) => {
    const {id} = req.params;
    const body = req.body;
    try {
      const category = await Category.findByPk(id);
      if(!category) throw new NotFoundError("Category not found");

      await category.update(body);
      generateResponse(res, category, 200, "Updated");
    } catch (error) {
      next(error);
    }
  },
  deleteCategoryById: async (req, res, next) => {
    const {id} = req.params;
    try {
      const category = await Category.findByPk(id);
      if(!category) throw new NotFoundError("Category not found");

      await category.destroy();
      generateResponse(res, null, 200, "Deleted");
    } catch (error) {
      next(error);
    }
  }
}
