

'use strict';

/**
 * Module dependencies.
 */
var movieCtrl = require('../../app/controllers/movies');
var genreCtrl = require('../../app/controllers/genre');

module.exports = function(app) {
    ///////////////////// Movies ///////////////////////////////
    // List
    app.route('/movies').get(movieCtrl.list);

    // Create
    app.route('/movies').post(movieCtrl.create);

    // Update
    app.route('/movies/:movieId').put(movieCtrl.update);

    // Delete
    app.route('/movies/:movieId').delete(movieCtrl.delete);

    // Get movie
    app.route('/movies/:movieId').get(movieCtrl.view);


    ///////////////////// Genre ///////////////////////////////
    // List
    app.route('/genres').get(genreCtrl.list);

    // Create
    app.route('/genres').post(genreCtrl.create);

    // Update
    app.route('/genres/:genreId').put(genreCtrl.update);

    // Delete
    app.route('/genres/:genreId').delete(genreCtrl.delete);

    // Get movie
    app.route('/genres/:genreId').get(genreCtrl.view);
};


