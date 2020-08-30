angular.module('imdbApp.user').factory("MoviesStore", ['Global', '$q', function (Global, $q) {

    let usersStore = {
        modules: [] // Holds the modules list data
    };

    return usersStore;
}]);

angular.module('imdbApp.user').factory("MoviesService", ['$resource', 'Global', '$q', '$rootScope', function ($resource, Global, $q, $rootScope) {

    class moviesService {
        constructor() {

        }
        /***********************  Movies ****************************/
        createMovie(params) {
            let deferred = $q.defer();

            let movie = $resource('/movies', {
                apiKey: _.get(Global, 'user.apiKey', '')
            });

            let movieObj = new movie(params);
            movieObj.$save().then(
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }
        getMovies(params) {
            let deferred = $q.defer();

            let movie = $resource('/movies', {
                apiKey: Global.user.apiKey
            });

            let scopes = [];

            if (_.has(params, 'scopes')) {
                scopes = JSON.stringify(params.scopes);
            }

            movie.get({
                    page: _.has(params, 'page') ? params.page : '',
                    orderBy: _.has(params, 'orderBy') ? params.orderBy : '',
                    criteria: _.has(params, 'criteria') ? params.criteria : '',
                    limitPerPage: _.has(params, 'limitPerPage') ? params.limitPerPage : '',
                    scopes: scopes
                },
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
        getMovie(params) {
            let deferred = $q.defer();
            let scopes = [];

            if (_.has(params, 'scopes')) {
                scopes = JSON.stringify(params.scopes);
            }

            let movie = $resource('/movies/:movieId', {
                apiKey: Global.user.apiKey,
                movieId: '@movieId'
            });

            movie.get({
                movieId: params.movieId,
                scopes: scopes

            }).$promise.then(function(movie) {
                deferred.resolve(movie);
            });

            return deferred.promise;
        }
        updateMovie(params) {
            let deferred = $q.defer();

            let movie = $resource('/movies/:movieId', {
                    apiKey: Global.user.apiKey,
                    movieId: params.movieId
                },
                {
                    update: {
                        method: 'PUT',
                        params: {
                            isUpdate: true
                        },
                        interceptor: {
                            request: function(config) {
                                // Before the request is sent out, store a timestamp on the request config
                                config.requestTimestamp = Date.now();
                                return config;
                            },
                            response: function(response) {
                                // Get the instance from the response object
                                var instance = response.resource;

                                // Augment the instance with a custom `saveLatency` property, computed as the time
                                // between sending the request and receiving the response.
                                instance.saveLatency = Date.now() - response.config.requestTimestamp;

                                // Return the instance
                                return instance;
                            }
                        }
                    }
                }
            );

            movie.update(params).$promise.then(
                function(response) {
                    deferred.resolve(response);
                },
                function(error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }
        deleteMovie(params) {
            let deferred = $q.defer();

            let movie = $resource('/movies/:movieId', {
                    apiKey: Global.user.apiKey,
                    movieId: '@movieId'
                },
                {
                    delete: {
                        method: 'DELETE',
                        params: {
                            isUpdate: true,
                            status: -1
                        },
                        interceptor: {
                            request: function (config) {
                                // Before the request is sent out, store a timestamp on the request config
                                config.requestTimestamp = Date.now();
                                return config;
                            },
                            response: function (response) {
                                // Get the instance from the response object
                                var instance = response.resource;

                                // Augment the instance with a custom `saveLatency` property, computed as the time
                                // between sending the request and receiving the response.
                                instance.saveLatency = Date.now() - response.config.requestTimestamp;

                                // Return the instance
                                return instance;
                            }
                        }
                    }
                }
            );

            movie.delete({movieId: params.movieId}).$promise.then(
                function (response) {
                    deferred.resolve(response);
                },
                function(error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }

        /***********************  Genre ****************************/
        createGenre(params) {
            let deferred = $q.defer();

            let genre = $resource('/genres', {
                apiKey: _.get(Global, 'user.apiKey', '')
            });

            let genreObj = new genre(params);
            genreObj.$save().then(
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }
        getGenres(params) {
            let deferred = $q.defer();

            let genre = $resource('/genres', {
                apiKey: Global.user.apiKey
            });

            let scopes = [];

            if (_.has(params, 'scopes')) {
                scopes = JSON.stringify(params.scopes);
            }

            genre.get({
                    page: _.has(params, 'page') ? params.page : '',
                    orderBy: _.has(params, 'orderBy') ? params.orderBy : '',
                    criteria: _.has(params, 'criteria') ? params.criteria : '',
                    limitPerPage: _.has(params, 'limitPerPage') ? params.limitPerPage : '',
                    scopes: scopes
                },
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
        getGenre(params) {
            let deferred = $q.defer();
            let scopes = [];

            if (_.has(params, 'scopes')) {
                scopes = JSON.stringify(params.scopes);
            }

            let genre = $resource('/genres/:genreId', {
                apiKey: Global.user.apiKey,
                genreId: '@genreId'
            });

            genre.get({
                genreId: params.genreId,
                scopes: scopes

            }).$promise.then(function(genre) {
                deferred.resolve(genre);
            });

            return deferred.promise;
        }
        updateGenre(params) {
            let deferred = $q.defer();

            let genre = $resource('/genres/:genreId', {
                    apiKey: Global.user.apiKey,
                    genreId: params.genreId
                },
                {
                    update: {
                        method: 'PUT',
                        params: {
                            isUpdate: true
                        },
                        interceptor: {
                            request: function(config) {
                                // Before the request is sent out, store a timestamp on the request config
                                config.requestTimestamp = Date.now();
                                return config;
                            },
                            response: function(response) {
                                // Get the instance from the response object
                                var instance = response.resource;

                                // Augment the instance with a custom `saveLatency` property, computed as the time
                                // between sending the request and receiving the response.
                                instance.saveLatency = Date.now() - response.config.requestTimestamp;

                                // Return the instance
                                return instance;
                            }
                        }
                    }
                }
            );

            genre.update(params).$promise.then(
                function(response) {
                    deferred.resolve(response);
                },
                function(error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }
        deleteGenre(params) {
            let deferred = $q.defer();

            let genre = $resource('/genres/:genreId', {
                    apiKey: Global.user.apiKey,
                    genreId: '@genreId'
                },
                {
                    delete: {
                        method: 'DELETE',
                        params: {
                            isUpdate: true,
                            status: -1
                        },
                        interceptor: {
                            request: function (config) {
                                // Before the request is sent out, store a timestamp on the request config
                                config.requestTimestamp = Date.now();
                                return config;
                            },
                            response: function (response) {
                                // Get the instance from the response object
                                var instance = response.resource;

                                // Augment the instance with a custom `saveLatency` property, computed as the time
                                // between sending the request and receiving the response.
                                instance.saveLatency = Date.now() - response.config.requestTimestamp;

                                // Return the instance
                                return instance;
                            }
                        }
                    }
                }
            );

            genre.delete({genreId: params.genreId}).$promise.then(
                function (response) {
                    deferred.resolve(response);
                },
                function(error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }
    }

    return moviesService;
}]);


