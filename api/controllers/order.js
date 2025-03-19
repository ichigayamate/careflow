const {Order, OrderItem} = require('../models');
const {generateResponse} = require("../views/response-entity");
const {NotFoundError, ForbiddenError} = require("../helpers/error");
const {Op} = require("sequelize");

module.exports = {
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        include: [{
          association: 'Items',
          through: {
            attributes: ['quantity']
          }
        }, {
          association: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      generateResponse(res, orders)
    } catch (error) {
      next(error);
    }
  },
  getUserOrders: async (req, res, next) => {
    const user = req.user;
    try {
      const orders = await Order.findAll({
        where: {
          UserId: user.id
        },
        include: [{
          association: 'Items',
          through: {
            attributes: ['quantity']
          }
        }]
      });

      generateResponse(res, orders)
    } catch (error) {
      next(error);
    }
  },
  getOrderById: async (req, res, next) => {
    const {id} = req.params;
    const user = req.user;
    try {
      const order = await Order.findByPk(id, {
        include: [{
          association: 'Items',
          through: {
            attributes: ['quantity']
          }
        }, {
          association: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      if (!order) throw new NotFoundError("Order not found");
      if (user.role !== 'admin' && order.UserId !== user.id) {
        throw new ForbiddenError("You are not allowed to access this order");
      }

      generateResponse(res, order)
    } catch (error) {
      next(error);
    }
  },
  deleteOrderById: async (req, res, next) => {
    const {id} = req.params;
    try {
      const order = await Order.findByPk(id);

      if (!order) throw new NotFoundError("Order not found");

      const orderItem = await OrderItem.findAll({
        where: {
          OrderId: id
        }
      });

      await OrderItem.destroy({
        where: {
          [Op.and]: {
            id: orderItem.map(item => item.id)
          }
        }
      }).then(async () => {
        await order.destroy();
      })

      generateResponse(res, null, 200, "Deleted")
    } catch (error) {
      next(error);
    }
  }
}
