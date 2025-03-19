'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Item, {
        foreignKey: 'category',
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Category name must be unique"
      },
      validate: {
        notNull: {
          msg: "Name is required"
        },
        notEmpty: {
          msg: "Name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required"
        },
        notEmpty: {
          msg: "Description cannot be empty"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
