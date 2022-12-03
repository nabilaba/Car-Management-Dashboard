'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cars.init({
    name: DataTypes.TEXT,
    rent_price: DataTypes.FLOAT,
    size: DataTypes.TEXT,
    image_url: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'cars',
  });
  return cars;
};