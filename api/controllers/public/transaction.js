const {NotFoundError, BadRequestError} = require("../../helpers/error");
const {Order, Item, OrderItem} = require("../../models");
const {generateResponse} = require("../../views/response-entity");
const {sequelize} = require("../../models");
const midtransClient = require('midtrans-client');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // requires authentication
  buyItem: async (req, res, next) => {
    const {itemId, quantity, midtransId} = req.body;
    const user = req.user;
    try {
      // check if item is available
      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      // check if item is available
      if (item.quantity < quantity) {
        throw new BadRequestError("Item out of stock");
      }
      // create transaction
      const transaction = await sequelize.transaction(async (t) => {
        const order = await Order.create({
          UserId: user.id,
          midtransId,
        }, {transaction: t});

        await OrderItem.create({
          OrderId: order.id,
          ItemId: item.id,
          quantity: quantity,
          price: item.price
        }, {transaction: t});

        return order;
      });

      // update item stock
      await item.update({
        quantity: item.quantity - quantity
      });

      generateResponse(res, transaction, 201, "Transaction success");
    } catch (err) {
      next(err)
    }
  },
  generateMidtransToken: async (req, res, next) => {
    const {itemId, quantity} = req.body;
    const user = req.user;
    try {
      // check if item is available
      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      // check if item is available
      if (item.quantity < quantity) {
        throw new BadRequestError("Item out of stock");
      }

      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY
      });

      const parameter = {
        transaction_details: {
          order_id: "CAREFLOW-" + uuidv4(),
          gross_amount: item.price * quantity
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }

      snap.createTransaction(parameter)
        .then((transaction) => {
          generateResponse(res, transaction, 201, "Token generated");
        })
        .catch((err) => {
          next(err)
        });
    } catch (e) {
      next(e)
    }
  }
}
