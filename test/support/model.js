'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.TEST_DB);

const User = sequelize.define('user',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false
  }
);

module.exports = User;
