'use strict';

/**
 * Authorization
 * @module Authorization
 */

/**
 * Module dependencies.
 */
var StandardError = require('standard-error'),
    db = require('../../config/sequelize'),
    _ = require('lodash');


/**
 * Is user is admin
 *
 * @param req
 * @param res
 *
 * @returns {object} user
 */
exports.hasAdminAccess = function(req, res) {
    var apiKey = req.param('apiKey'),
        options = {
            where: {
                apiKey: apiKey
            }
        };

    var user = db.User.findAll(options).then(function (user) {
        if (user.length) {
            return user;
        } else {
            return res.jsonp({
                message: "Invalid Api Key",
                error: true
            });
        }
    });

    return user;
};
