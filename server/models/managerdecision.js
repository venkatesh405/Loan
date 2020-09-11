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

        customerUsername: {
            type: Sequelize.STRING,
            allowNull: false
        },

        CRMUsername: {
            type: Sequelize.STRING,
            allowNull: false
        },

        managerusername: {
            type: Sequelize.STRING,
            allowNull: false
        }
    };

var modelOptions = {};

var managerdecisionModel = db.define('managerdecision', modelDefinition,modelOptions);

module.exports = managerdecisionModel;