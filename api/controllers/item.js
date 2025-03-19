const {Item} = require('../models')
const {generateResponse} = require("../views/response-entity");
const {NotFoundError} = require("../helpers/error");

module.exports = {
  async getAllItems(req, res, next) {
    try {
      const allItem = await Item.findAll({
        include: {
          association: 'Category',
          attributes: ['id', 'name', 'description']
        },
        attributes: {
          exclude: ['category'],
        },
        order: [['createdAt', 'DESC']]
      });
      generateResponse(res, allItem);
    } catch (err) {
      next(err)
    }
  },
  async getItemById(req, res, next) {
    try {
      const item = await Item.findByPk(req.params.id, {
        include: {
          association: 'Category',
          attributes: ['id', 'name', 'description']
        },
        attributes: {
          exclude: ['category'],
        },
      });
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      generateResponse(res, item);
    } catch (err) {
      next(err)
    }
  },
  async createItem(req, res, next) {
    try {
      const item = await Item.create(req.body);
      generateResponse(res, item, 201, "Created");
    } catch (err) {
      next(err)
    }
  },
  async updateItem(req, res, next) {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      await item.update(req.body);
      generateResponse(res, item);
    } catch (err) {
      next(err)
    }
  },
  async restockItem(req, res, next) {
    const {id} = req.params;
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      await item.update({
        stock: item.stock + req.body.quantity
      });
      generateResponse(res, item);
    } catch (err) {
      next(err)
    }
  },
  async deleteItem(req, res, next) {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      await item.destroy();
      generateResponse(res, null, 200, "Deleted");
    } catch (err) {
      next(err)
    }
  }
}
