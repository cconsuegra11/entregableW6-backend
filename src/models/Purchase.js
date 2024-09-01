const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const ModelName = sequelize.define('modelName', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
});

module.exports = ModelName;