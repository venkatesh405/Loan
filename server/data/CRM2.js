// CRM - Client Relationship Manager

'use strict';
var jwt = require('jsonwebtoken');

var config = require('../config/config'),
    db = require('../services/database'),
    customer = require('../models/customer');

var customerController = {};

//Add a customer
customerController.addcustomer = function(req, res) {
        db.sync().then(function() {
            var newcustomer = {
                userName: req.body.username,
                lastName: req.body.lname,
                firstName: req.body.fname
            };

            return customer.create(newcustomer).then(function() {
                res.status(201).json({ message: 'New customer has been added!' });
            });
        }).catch(function(error) {
            res.status(403).json({ message: 'Request Failed!' });
        });
    }
//Get all customers
customerController.getcustomer = function(req, res) {
         customer.findAll().then(function(customer) {
            if(!customer) {
                res.status(404).json({ message: 'Query failed!' });
            } 
            else { res.status(200).json(customer);
            }
        }).catch(function(error) {
            res.status(500).json({ message: 'There was an error!' });
        });
    }

//Get customer info using Username
customerController.getcustomerDetails = function(req, res) {
   console.log("get customer Details");
        db.sync().then(function() {
            var username = req.body.username,
                potentialMatch = { where: { userName: username } };

            return customer.findOne(potentialMatch).then(function(matchedcustomer) {
                res.status(201).json(matchedcustomer);
            });
        }).catch(function(error) {
            res.status(403).json({ message: 'Request Failed!' });
        });
 
    }


module.exports = customerController;
