'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
    // User Routes
    var users = require('../../app/controllers/users');

    // User Routes
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    // Setting up the users api
    app.post('/users', users.create);

    // Setting the local strategy route

    app.post('/users/session', function(req, res, next) {
        passport.authenticate('local',
            function(err, user, info) {
                if (err) {
                    console.log('--> | err ', err);
                    debugger;

                    return next(err);
                }
                if (!user) {
                    debugger;
                    return res.send({success: false, message: 'User not found'});
                    // return res.send('/login');
                }
                req.logIn(user, function(err) {
                    console.log('--> | user ', user);
                    if (err) {
                        return next(err);
                    }

                    return res.send({success: true, data: {user: user}});
                    //return res.redirect('/users/' + user.username);
                });
        })(req, res, next);
    });


    // Setting social authentication routes
    app.post('/auth/facebook/token', users.facebookUser);

    app.post('/auth/google', users.googleSocailUser);

    // Setting the twitter oauth route
    app.post('/auth/twitter', users.twitterSocialUser);

    // Finish with setting up the userId param
    app.param('userId', users.user);


};

