'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Category, {
        foreignKey: 'category',
      });
      Item.belongsToMany(models.Order, {
        through: 'OrderItems',
      })
    }
  }

  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        },
        notNull: {
          msg: 'Description is required'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category cannot be empty'
        },
        notNull: {
          msg: 'Category is required'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be a positive number'
        },
        notNull: {
          msg: 'Price is required'
        },
        notEmpty: {
          msg: 'Price cannot be empty'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Quantity must be a positive number'
        },
        notNull: {
          msg: 'Quantity is required'
        },
        notEmpty: {
          msg: 'Quantity cannot be empty'
        }
      }
    },
    prescription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};
