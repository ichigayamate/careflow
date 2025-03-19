const {Item} = require('../../models')
const {generateResponse} = require("../../views/response-entity");
const {NotFoundError} = require("../../helpers/error");

module.exports = {
  async getPublicItems(req, res, next) {
    try {
      const allItem = await Item.findAll({
        include: {
          association: 'Category',
          attributes: ['name', 'description']
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
  async getPublicItemById(req, res, next) {
    const {id} = req.params;
    try {
      const item = await Item.findByPk(id,{
        include: {
          association: 'Category',
          attributes: ['name', 'description']
        },
        attributes: {
          exclude: ['category'],
        },
      });
      generateResponse(res, item);
    } catch (err) {
      next(err)
    }
  },
}
