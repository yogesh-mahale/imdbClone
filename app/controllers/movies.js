'use strict';

/**
 * Movies
 * @module Movie
 */

/**
 * Module dependencies.
 */
var StandardError = require('standard-error'),
    db = require('../../config/sequelize'),
    Authorization = require('./authorization.js'),
    _ = require('lodash');


exports.list = function (req, res) {
    Authorization.hasAdminAccess(req, res).then(function (user) {
        if (user.length) {
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
                            $or: [
                                {
                                    name: {
                                        $like: `%${criteria.where.query}%`
                                    }
                                },
                                {
                                    director: {
                                        $like: `%${criteria.where.query}%`
                                    }
                                }
                            ]
                        }
                    );
                }

                if (_.has(criteria, 'where.genres')) {
                    options = Object.assign(
                        options,
                        {
                            include: [{
                                model: db.Movie_genre,
                                required: true,
                                where: {
                                    genreId: criteria.where.genres
                                },
                                include: [{
                                    model: db.Genre,
                                    required: false
                                }]
                            }]
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

            var scopes = [
                {
                    method: ['withAddedBy', {'params': null }]
                },
                {
                    method: ['withUpdatedBy', {'params': null }]
                },
                {
                    method: ['withMovieGenre', {'params': null }]
                },
                {
                    method: ['offsetLimit', {'offset': offset, 'limit': limit}]
                },
                {
                    method: ['orderBy', req.param('orderBy')]
                }
            ];


            db.Movie.scope(scopes).findAndCountAll(options).then(function (result) {
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

        } else {
            return res.jsonp({error: true, message: 'Not authenticated user'});
        }
    });
};

exports.create = async function (req, res) {
    let user = await Authorization.hasAdminAccess(req, res);

    if (!user) {
        return res.jsonp({error: true, message: 'Not authenticated user'});
    }

    let genres = req.param('genres');

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
        let movie = await db.Movie.create(params);

        // Update the genres as well
        if (genres) {
            genres.forEach(async function(item) {
                let options = {
                    movieId: movie.id,
                    genreId: item.id
                };

                let movieGenre = await db.Movie_genre.create(options);
            });
        };

        return res.jsonp({
            success: true,
            movie: movie
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
            id: req.param('movieId'),
            status: {
                $ne: -1
            }
        }
    };

    var scopes = [
        {
            method: ['withAddedBy', {'params': null }]
        },
        {
            method: ['withUpdatedBy', {'params': null }]
        },
        {
            method: ['withMovieGenre', {'params': null }]
        }
    ];

    try {
        let movie = await db.Movie.scope(scopes).findOne(options);

        return res.jsonp(movie);
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

    let id = req.param('movieId');

    db.Movie.destroy({
        where: {
            id: id
        }
    }).then(function (movie) {
        return res.jsonp({
            success: true,
            message: "Movie is removed successfully",
            movie: movie
        });
    });
};

exports.update = async function(req, res) {
    let user = await Authorization.hasAdminAccess(req, res);

    if (!user) {
        return res.jsonp({error: true, message: 'Not authenticated user'});
    }

    let genres = req.param('genres');
    let id = req.param('movieId');

    let options = {
        where: {
            id: id
        }
    };

    try {
        let movie = await db.Movie.findOne(options);

        // Prepare request data. Get data from req.body and prepare it.
        let params = {};
        for (let [key, value] of Object.entries(req.body)) {
            //console.log(`${key}: ${value}`);
            params[key] = value;
        }

        movie.updateAttributes(params);

        // Update the genres as well
        if (genres) {
            await db.Movie_genre.destroy({
                where: {
                    movieId: id
                }
            });

            genres.forEach(async function(item) {
                let options = {
                    movieId: id,
                    genreId: item.id
                };

                let movieGenre = await db.Movie_genre.create(options);
            });
        };

        return res.jsonp({
            success: true,
            message: "Record is updated successfully",
            movie: movie
        });
    } catch (err) {
        return res.send('404', {
            error: true,
            message: JSON.stringify(err),
            status: 500
        });
    }
};
