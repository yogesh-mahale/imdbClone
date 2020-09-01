'use strict';

/**
 * Movies
 * @module Genre
 */

/**
 * Module dependencies.
 */
var StandardError = require('standard-error'),
    db = require('../../config/sequelize'),
    Authorization = require('./authorization.js'),
    _ = require('lodash');


exports.list = function (req, res) {
    var limitPerPage = req.param('limitPerPage'),
        limit = parseInt(limitPerPage),
        offset = 0,
        page = req.param('page'),
        pages = 0,
        criteria = req.param('criteria') ? JSON.parse(req.param('criteria')) : null;

    if (limit > 0) {
        offset = limit * (page - 1);
    }

    var options = {
        where: {
            status: {
                ne: -1
            }
        }
    };

    if (criteria) {
        if (_.has(criteria, 'where.query')) {
            options.where = Object.assign(
                options.where,
                {
                    name: {
                        $like: `%${criteria.where.query}%`
                    }
                }
            );
        }

        if (_.has(criteria, 'where.status')) {
            options.where = Object.assign(
                options.where,
                {
                    status: criteria.where.status
                }
            );
        }
    }

    /*var scopes = [
        {
            method: ['offsetLimit', {'offset': offset, 'limit': limit}]
        },
        {
            method: ['orderBy', req.param('orderBy')]
        }
    ];*/

    db.Genre.findAndCountAll(options).then(function (result) {
        pages = Math.ceil(result.count / limit);
        return res.jsonp({
            'count': result.count,
            'page': parseInt(page),
            'offset': parseInt(offset),
            'limitPerPage': parseInt(limitPerPage),
            'pages': pages,
            'result': result.rows
        });
    });
};

exports.create = async function (req, res) {
    let user = await Authorization.hasAdminAccess(req, res);

    if (!user) {
        return res.jsonp({error: true, message: 'Not authenticated user'});
    }

    req.body.addedBy = user[0].id;
    req.body.addedOn = new Date();
    req.body.updatedBy = user[0].id;
    req.body.updatedOn = new Date();
    req.body.status = 1;

    // Prepare request data. Get data from req.body and prepare it.
    let params = {};
    for (let [key, value] of Object.entries(req.body)) {
        params[key] = value;
    }

    try {
        let genre = await db.Genre.create(params);

        return res.jsonp({
            success: true,
            genre: genre
        });
    } catch (err) {
        return res.send('500', {
            error: true,
            message: JSON.stringify(err),
            status: 500
        });
    }
};

exports.view = async function (req, res) {

    let options = {
        where: {
            id: req.param('genreId'),
            status: {
                $ne: -1
            }
        }
    };

    try {
        let genre = await db.Genre.findOne(options);

        return res.jsonp(genre);
    } catch (err) {
        return res.send('404', {
            error: true,
            message: err.message,
            status: 404
        });
    }
};

exports.delete = async function (req, res) {
    let user = await Authorization.hasAdminAccess(req, res);

    if (!user) {
        return res.jsonp({error: true, message: 'Not authenticated user'});
    }

    let id = req.param('genreId');

    db.Genre.destroy({
        where: {
            id: id
        }
    }).then(function (genre) {
        return res.jsonp({
            success: true,
            message: "Genre is removed successfully",
            genre: genre
        });
    });
};

exports.update = async function(req, res) {
    let user = await Authorization.hasAdminAccess(req, res);

    if (!user) {
        return res.jsonp({error: true, message: 'Not authenticated user'});
    }

    let id = req.param('genreId');

    let options = {
        where: {
            id: id
        }
    };

    try {
        let genre = await db.Genre.findOne(options);

        // Prepare request data. Get data from req.body and prepare it.
        let params = {};
        for (let [key, value] of Object.entries(req.body)) {
            //console.log(`${key}: ${value}`);
            params[key] = value;
        }

        genre.updateAttributes(params);

        return res.jsonp({
            success: true,
            message: "Record is updated successfully",
            genre: genre
        });
    } catch (err) {
        return res.send('404', {
            error: true,
            message: JSON.stringify(err),
            status: 500
        });
    }
};
