'use strict';

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');

var modelDefinition = {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    userName: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
};

var customerModel = db.define('customer', modelDefinition);

module.exports = customerModel;