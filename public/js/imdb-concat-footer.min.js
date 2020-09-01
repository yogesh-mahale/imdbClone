
authenticate.$inject = ['$q', 'Global', '$state', '$timeout'];var app = angular.module('imdbApp', ['ngCookies', 'ngResource', 'ui.router', 'ngSanitize', 'ui.bootstrap',  'ngMessages', 'ngRoute', 'ngAnimate', 'isteven-multi-select',
    'ui-notification', 'imdbApp.system', 'imdbApp.auth', 'imdbApp.user']);

angular.module('imdbApp.system', []);
angular.module('imdbApp.auth', []);
angular.module('imdbApp.user', []);

//Setting up route

angular.module('imdbApp').config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise(function($injector, $location){
        $injector.invoke(['$state', function($state) {
            $state.go('home');
        }]);
    });

    $stateProvider
        .state('home',{
            url : '/',
            templateUrl: 'views/index.html'
        })
        .state('login',{
            /* /login */
            url : '/login',
            templateUrl: 'views/auth/login.html'
        })
        .state('signUp',{
            /* /signup */
            url : '/signup',
            templateUrl: 'views/auth/signUp.html'
        })
        .state('movies',{
            url : '/movies',
            templateUrl: 'views/movie/index.html'
        })
        .state('movies.list',{
            url : '/list',
            templateUrl: 'views/movie/list.html',
            resolve: { authenticate: authenticate }
        })
        .state('movies.add',{
            url : '/add',
            templateUrl: 'views/movie/add.html'
        })
        .state('movies.edit',{
            //#/movies/edit/1
            url : '/{movieId}/edit',
            params : {
                'movieId': null // movieId
            },
            views : {
                //the main template will be placed here (relatively named)
                '' : {
                    templateUrl: 'views/movie/add.html'
                }
            }
        })
        .state('movies.view',{
            //#/movies/edit/1
            url : '/{movieId}/view',
            params : {
                'movieId': null // movieId
            },
            views : {
                //the main template will be placed here (relatively named)
                '' : {
                    templateUrl: 'views/movie/view.html'
                }
            }
        })
        .state('genres',{
            url : '/genres',
            templateUrl: 'views/genre/index.html'
        })
        .state('genres.list',{
            url : '/list',
            templateUrl: 'views/genre/list.html'
        })
        .state('genres.add',{
            url : '/add',
            templateUrl: 'views/genre/add.html'
        })
        .state('genres.edit',{
            //#/genres/edit/1
            url : '/{genreId}/edit',
            params : {
                'genreId': null // genreId
            },
            views : {
                //the main template will be placed here (relatively named)
                '' : {
                    templateUrl: 'views/genre/add.html'
                }
            }
        })
        .state('404',{
            url : '/404',
            templateUrl: 'views/404.html'
        });
}]);

function authenticate($q, Global, $state, $timeout) {
    if (_.get(Global, 'user.isAdmin', null)) {
        // Resolve the promise successfully
        return $q.when();
    } else {
        // The next bit of code is asynchronously tricky.

        $timeout(function() {
            // This code runs after the authentication promise has been rejected.
            // Go to the log-in page
            $state.go('login');
        });

        // Reject the authentication promise to prevent the state from loading
        return $q.reject();
    }
}

/*//Setting HTML5 Location Mode
angular.module('imdbApp').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);*/

/**
 * Table sorting asc and desc
 */
app.directive('sort', function() {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: '../views/directive/sort/sort.html',
        scope: {
            by: '=',
            reverse : '=',
            orderBy: '=orderBy',
            columnName : '=columnName',
            onClickSort: '&onClick'
        },
        link: function(scope, element, attrs) {
            // Show asc/desc icon as per current order by status
            if (scope.orderBy) {
                scope.orderByArr = scope.orderBy.split(' '); //eg. ['updatedOn', 'DESC']

                // if current order by and column name is match then set scope.by and scope.reverse
                if (scope.columnName === scope.orderByArr[0]) {
                    scope.by = scope.columnName;

                    if (scope.orderByArr[0] === 'ASC') {
                        scope.reverse = false;
                    } else if (scope.orderByArr[1] === 'DESC') {  //DESC means reverse, ASC means not reverse
                        scope.reverse = true;
                    }
                }
            }

            scope.handleClick = function() {
                let orderBy = [];
                if (scope.columnName === scope.by) {
                    scope.reverse = !scope.reverse;
                } else {
                    // Sort descending
                    scope.reverse = false;
                    scope.by = scope.columnName;
                }

                if (scope.reverse) {
                    orderBy[0] = scope.columnName;
                    orderBy[1] = 'DESC';
                } else {
                    orderBy[0] = scope.columnName;
                    orderBy[1] = 'ASC';
                }

                scope.onClickSort({
                    options: {
                        orderBy: orderBy.join(' ')
                    }
                });
            };
        }
    }
});

angular.module('imdbApp.system').factory("Global",['$cookies',function($cookies) {
    var _this = this;

    _this._data = {
        user: window.user,
        cookieAuth:'isLogin',
        cookieImdb:'imdb',
        cookieDomain:'imdb.com',
        authenticated: !! window.user
    };

    return _this._data;
}]);
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
                apiKey: _.get(Global, 'user.apiKey', '')
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
                apiKey: _.get(Global, 'user.apiKey', ''),
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
                apiKey: _.get(Global, 'user.apiKey', '')
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
                apiKey: _.get(Global, 'user.apiKey', ''),
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



angular.module('imdbApp.user').factory("UsersStore", ['Global', '$q', function (Global, $q) {

    let usersStore = {
        modules: [] // Holds the modules list data
    };

    return usersStore;
}]);

angular.module('imdbApp.user').factory("UsersService", ['$resource', 'Global', '$q', '$rootScope', function ($resource, Global, $q, $rootScope) {

    class usersService {
        constructor() {

        }
        /***********************  users Survey ****************************/
        getUsers(params) {
            let deferred = $q.defer();

            let user = $resource('/users', {
                apiKey: Global.user.apiKey
            });

            let scopes = [];

            if (_.has(params, 'scopes')) {
                scopes = JSON.stringify(params.scopes);
            }

            user.get({
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

        signIn(params) {
            let deferred = $q.defer();

            console.log(Global);

            let user = $resource('/users/session', {
                apiKey: _.get(Global, 'user.apiKey', '')
            });

            var userObj = new user(params);
            userObj.$save().then(
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }

        signup(params) {
            let deferred = $q.defer();

            console.log(Global);

            let user = $resource('/users', {
                apiKey: _.get(Global, 'user.apiKey', '')
            });

            var userObj = new user(params);
            userObj.$save().then(
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.resolve(error);
                }
            );

            return deferred.promise;
        }

        signOut(params) {
            let deferred = $q.defer();

            let user = $resource('/signout', {
                apiKey: _.get(Global, 'user.apiKey', '')
            });

            user.get({},
                function (response) {
                    deferred.resolve(response);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }

    return usersService;
}]);



angular.module('imdbApp.system').controller('HeaderController', ['$scope', '$window', 'Global', '$state', '$stateParams', 'UsersService', function ($scope, $window, Global, $state, $stateParams, UsersService) {

    /****************** VM Variables Declarations ************/
    let vm = this;

    /****************** Scopes Declarations ************/
    $scope.$stateParams = $stateParams;
    $scope.$state = $state;

    $scope.getHeaderCtrlInstance = function () {
        return vm;
    };

    /****************** VM Methods Declarations ************/
    /**
     * Logout functionality
     */
    vm.logout = function() {
        //1. Logout from server
        let usersService = new UsersService();
        usersService.signOut().then(function(response) {
            if(response.status === 'success'){
                //1.2 Reset the user
                $scope.global = null;

                //1.3 Go to login page
                $state.go('login');
            }
        });
    };

    /****************** Controller Initialization ************/
    function init() {
        console.log('--> | Initialized the HeaderController...');
    }

    // Staring point of ctrl.
    init();
}]);
angular.module('imdbApp.system').controller('MainController', ['$scope', '$window', 'Global', '$state', '$stateParams', 'UsersService', function ($scope, $window, Global, $state, $stateParams, UsersService) {

    /****************** VM Variables Declarations ************/
    let vm = this;

    /****************** Scopes Declarations ************/
    $scope.$stateParams = $stateParams;
    $scope.$state = $state;

    $scope.getMainCtrlInstance = function () {
        return vm;
    };

    /****************** Controller Initialization ************/
    function init() {
        console.log('--> | Initialized the MainController...');

        $scope.global = Global;
    }

    // Staring point of ctrl.
    init();
}]);
angular.module('imdbApp.user').controller('MovieController', ['$scope', '$window', 'Global', '$state', '$stateParams', 'UsersService', 'MoviesService', 'Notification',function ($scope, $window, Global, $state, $stateParams, UsersService, MoviesService, Notification) {

    /****************** VM Variables Declarations ************/
    let vm = this;

    // Holds the movie default img.
    vm.defaultImg = 'https://m.media-amazon.com/images/M/MV5BOTVjMmFiMDUtOWQ4My00YzhmLWE3MzEtODM1NDFjMWEwZTRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg';

    // Holds the data of add movie form
    vm.movie = {
        id: null,
        name: null,
        director: null,
        writer: null,
        cast: null,
        description: null,
        imdbScore: null,
        popularity: null,
        releaseDate: null
    };

    vm.movies = []; // Holds the list of movies

    // Holds the details of paginations
    vm.pagination = {
        movie: {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        },
        genre: {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        }
    };

    // Holds the filter criteria
    vm.filter = {
        movie: {
            query: null,
            genres: null,
            orderBy: null
        }
    };

    vm.genres = []; // Holds the genres list

    // Holds the data of 'add genre form'
    vm.genre = {
        id: null,
        name: null,
        status: null
    };

    // Holds the select2 data for movieGenre dropdown on Add/Edit movie form
    vm.movieGenre = {
        access: 1, //
        genres: [],
        selectedMembers: []
    };


    /****************** Scopes Declarations ************/
    $scope.$stateParams = $stateParams;
    $scope.$state = $state;

    $scope.getUserCtrlInstance = function () {
        return vm;
    };

    $scope.maxSize = 5; // Max pagination pages

    /****************** VM Methods Declarations ************/
    /**
     * Create or Edit movie
     *
     * @param movieForm
     */
    vm.submit = function(movieForm) {
        //1. Check does form valid
        if (movieForm.$valid) {
            //2. If movie is in edit mode. Update the movie
            if (vm.movie.id) {
                //2.0 Note: Movie name should not be edited
                let params = {
                    movieId: vm.movie.id,
                    director: vm.movie.director,
                    writer: vm.movie.writer,
                    cast: vm.movie.cast,
                    description: vm.movie.description,
                    imdbScore: vm.movie.imdbScore,
                    popularity: vm.movie.popularity,
                    releaseDate: vm.movie.releaseDate,
                    genres: vm.movieGenre.selectedMembers
                };

                //3. Update the movie by calling api
                let moviesService = new MoviesService();
                moviesService.updateMovie(params).then(function (response) {
                    if (response.success) {

                        //3.1 Show success notification
                        Notification.success({
                            message: 'Movie updated successfully',
                            title: 'Success Notification'
                        });

                        //3.2 Go to the movies list
                        setTimeout(function () {
                            $state.go('movies.list');
                        }, 500);
                    } else {
                        //3.1 On error show error notification
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            } else {
                //2. If movie is not in edit mode. Create the movie
                let params = {
                    name: vm.movie.name,
                    director: vm.movie.director,
                    writer: vm.movie.writer,
                    cast: vm.movie.cast,
                    description: vm.movie.description,
                    imdbScore: vm.movie.imdbScore,
                    popularity: vm.movie.popularity,
                    releaseDate: vm.movie.releaseDate,
                    genres: vm.movieGenre.selectedMembers
                };

                //3 Call the movie create api
                let moviesService = new MoviesService();
                moviesService.createMovie(params).then(function (response) {
                    if (response.success) {
                        //3.1 Show success notification
                        Notification.success({
                            message: 'Movie created successfully',
                            title: 'Success Notification'
                        });

                        //3.2 Go to the movies list
                        setTimeout(function () {
                            $state.go('movies.list');
                        }, 500);
                    } else {
                        //3.1 On error show error notification
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }
                });
            }
        } else {
            //1.1 If form is invalid then show error
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    vm.initMovieList = function () {
        console.log('--> | in initMovieList');
        vm.getMovies(); // Get movies
        vm.getGenres(); // Get Genres
    };

    /**
     * Reset to default of movies params
     */
    vm.resetMoviesParams = function () {
        vm.movies = [];
        /*vm.pagination.movie = {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        };*/

        vm.pagination.movie.count = 0;
        vm.pagination.movie.page = 1;
        vm.pagination.movie.pages = 1;
        vm.pagination.movie.limitPerPage = 10;

        vm.filter = {
            movie: {
                query: null,
                genres: null,
                orderBy: null
            }
        };
    };

    /**
     * Sorting algorithm for movies
     */
    vm.sortMovies = function (options) {
        if (options.orderBy) {
            //1. Reset the params
            vm.resetMoviesParams();

            //2. Set order by column on which sorting apply
            vm.pagination.movie.orderBy = options.orderBy;

            //3. Prepare params
            let params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            //4. Get movies
            vm.getMovies(params);
        }
    };

    /**
     * Movie Search functionality
     * @param options
     * @returns {boolean}
     */
    vm.searchMovies = function (options) {
        //1. Reset the params
        if (_.get(options, 'reset', null)) {
            vm.filter.movie.query = null;
            vm.resetMoviesParams();
            vm.getMovies();
            return false;
        }

        //vm.resetMoviesParams();
        //2. Reset the params
        if (_.get(vm.filter, 'movie.query', null)) {
            let params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            //2.1 Set query param in criteria
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );

            //2.3 Fetch movies
            vm.getMovies(params);
        } else {
            //3 refresh the list
            vm.getMovies();
        }
    };

    /**
     * Filter the movies by genres on home page.
     * @param options
     * @returns {boolean}
     */
    vm.filterMovies = function (options) {
        //1. Reset the params
        if (_.get(options, 'reset', null)) {
            vm.filter.movie.query = null;
            vm.filter.movie.genres = null;
            vm.resetMoviesParams();
            vm.getMovies();
            return false;
        }

        //3. Prepare params
        let params = {
            page: vm.pagination.movie.page,
            limitPerPage: vm.pagination.movie.limitPerPage,
            orderBy: vm.pagination.movie.orderBy,
            criteria: {
                where: {}
            },
            scopes: []
        };

        //3.1 set query params
        if (_.get(vm.filter, 'movie.query', null)) {
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );
        }

        //3.2 set genres in criteria. So only records of selected genres will be filtered
        if (_.get(vm.filter, 'movie.genres', null)) {
            const objectArray = Object.entries(vm.filter.movie.genres);

            //3.2.1 Get genreIds array from form data
            let selectedGenreIds = [];
            objectArray.forEach(([key, value])   => {
                console.log(key);
                console.log(value);
                if (value) {
                    selectedGenreIds.push(key);
                }
            });

            //3.3 Set genres criteria
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    genres: selectedGenreIds
                }
            );
        }

        //4. Fetch movies
        vm.getMovies(params);
    };

    /**
     * Pagination of movies table
     *
     * @param page
     */
    vm.loadMoreMovies = function (page) {
        //1. Set current page of pagination
        vm.pagination.movie.page = page;

        //2. Prepare params
        let params = {
            page: vm.pagination.movie.page,
            limitPerPage: vm.pagination.movie.limitPerPage,
            orderBy: vm.pagination.movie.orderBy,
            criteria: {
                where: {}
            },
            scopes: ['withAddedBy']
        };

        if (_.get(vm.filter, 'movie.query', null)) {
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );
        }

        //3. Fetch movies if page is not last page
        if (params.page <= vm.pagination.movie.pages) {
            vm.getMovies(params);
        } else {
            console.log('--> End of movies pagination..');
        }
    };

    /**
     * Get the movies list from db.
     * @param params
     */
    vm.getMovies = function (params) {
        //1 If params not set then default params should be set
        if (!params) {
            //2. Reset the old data.
            vm.resetMoviesParams();

            //2.1 Default pagination params
            params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            if (_.get(vm.filter, 'movie.query', null)) {
                params.criteria.where = Object.assign(
                    params.criteria.where,
                    {
                        query: vm.filter.movie.query
                    }
                );
            }
        }

        //3. Fetch movies
        let moviesService = new MoviesService();
        moviesService.getMovies(params).then(function (movies) {
            //3.1 Parse the movies data
            vm.parseMoviesData(movies);
        });
    };

    /**
     * Parse the movies data
     * @param movies
     */
    vm.parseMoviesData = function (movies) {
        if (_.has(movies, 'result') && !_.isEmpty(movies.result)) {
            vm.movies = movies.result; // set movies list

            // Update pagination details
            vm.pagination.movie.count = movies.count;
            vm.pagination.movie.limitPerPage = movies.limitPerPage;
            vm.pagination.movie.page = movies.page;
            vm.pagination.movie.pages = movies.pages;
        }
    };

    /**
     * Open the movie details page.
     */
    vm.viewMovie = function() {
        vm.resetMovie();
        //1. Get movie using movieId in url
        if ($stateParams.movieId) {
            vm.getMovie($stateParams.movieId);
        }
    };

    /**
     * Initialize the movie edit page.
     */
    vm.initEditMovie = function() {
        if ($stateParams.movieId) {
            // Fetch movie
            vm.getMovie($stateParams.movieId)
        } else {
            vm.resetMovie();
        }

        // Fetch genres list
        vm.getGenres();
    };

    vm.resetMovie = function() {
        vm.movie = {
            id: null,
            name: null,
            director: null,
            writer: null,
            cast: null,
            description: null,
            imdbScore: null,
            popularity: null,
            releaseDate: null
        };
    };

    /**
     * Get movie details using movieId
     * @param movieId
     */
    vm.getMovie = function(movieId) {
        if (movieId) {
            //1. Prepare params
            let params = {
                movieId: movieId
            };

            //2. Fetch movie
            let moviesService = new MoviesService();
            moviesService.getMovie(params).then(function (movie) {
                vm.movie = movie;
                console.log('--> movie | ', vm.movie);
            });
        }
    };

    /**
     * Delete the movies
     * @param movieId
     */
    vm.deleteMovie = function(movieId) {
        //1 Delete movie by id
        let params = {
            movieId: movieId,
            status: -1
        };

        //2 Call Delete api
        let moviesService = new MoviesService();
        moviesService.deleteMovie(params).then(function (response) {
            if (response.error) {
                //2.1 Error notification
                Notification.error({
                    message: 'Error in updating movie',
                    title: 'Error Notification'
                });
            }

            if (response.success) {
                //2.2 Success notification
                Notification.success({
                    message: 'Movie deleted Successfully',
                    title: 'Success Notification'
                });

                //2.3 Refresh the list
                setTimeout(function() {
                    $state.reload();
                }, 500);
            }
        });
    };


    //////////////////// Genre //////////////////////
    vm.initGenreList = function () {
        console.log('--> | in initGenreList');
        vm.getGenres();
    };

    /**
     * Fetch genres list
     * @param params
     */
    vm.getGenres = function (params) {
        if (!params) {
            //1. Default pagination params
            params = {
                page: vm.pagination.genre.page,
                limitPerPage: vm.pagination.genre.limitPerPage,
                orderBy: vm.pagination.genre.orderBy,
                criteria: {
                    where: {}
                },
                scopes: []
            };
        }

        //2. Fetch details
        let moviesService = new MoviesService();
        moviesService.getGenres(params).then(function (genres) {
            vm.parseGenreData(genres);
        });
    };

    /**
     * Parse genres data
     * @param genres
     */
    vm.parseGenreData = function (genres) {
        if (_.has(genres, 'result') && !_.isEmpty(genres.result)) {
            vm.genres = genres.result;
            vm.movieGenre.genres = genres.result;

            // Update pagination details
            vm.pagination.genre.count = genres.count;
            vm.pagination.genre.limitPerPage = genres.limitPerPage;
            vm.pagination.genre.page = genres.page;
            vm.pagination.genre.pages = genres.pages;
        }
    };

    /**
     * Create the genre
     * @param genreForm
     */
    vm.submitGenre = function(genreForm) {
        if (genreForm.$valid) {
            if (vm.genre.id) {
                //1. Update the movie
                let params = {
                    name: vm.genre.name
                };

                //2. Update the genre
                let moviesService = new MoviesService();
                moviesService.updateGenre(params).then(function (response) {
                    if (response.success) {
                        Notification.success({
                            message: 'Genre updated successfully',
                            title: 'Success Notification'
                        });

                        //3. Go to genre list
                        setTimeout(function () {
                            $state.go('genre.list');
                        }, 500);
                    } else {
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            } else {
                //1. Create the genre
                let params = {
                    name: vm.genre.name,
                    status: 1
                };

                //2. Create the genre
                let moviesService = new MoviesService();
                moviesService.createGenre(params).then(function (response) {
                    if (response.success) {
                        Notification.success({
                            message: 'Genre created successfully',
                            title: 'Success Notification'
                        });

                        //3. Go to genre list
                        setTimeout(function () {
                            $state.go('genres.list');
                        }, 500);
                    } else {
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            }
        } else {
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    vm.onItemClick = function (data) {
        console.log(data);
    };

    /****************** Controller Initialization ************/
    function init() {
        console.log('--> | Initialized the MovieController...');
    }

    // Staring point of ctrl.
    init();
}]);
angular.module('imdbApp.user').controller('UserController', ['$scope', '$window', 'Global', '$state', '$stateParams', 'UsersService', 'Notification',function ($scope, $window, Global, $state, $stateParams, UsersService, Notification) {


    /****************** VM Variables Declarations ************/
    let vm = this;

    // Holds the signup user form data.
    vm.signUpUser = {
        name: null,
        email: null,
        password: null,
        isAdmin: null
    };

    // Holds the login user form data.
    vm.signInUser = {
        email: null,
        password: null
    };


    /****************** Scopes Declarations ************/
    $scope.$stateParams = $stateParams;
    $scope.$state = $state;

    $scope.getUserCtrlInstance = function () {
        return vm;
    };

    /****************** VM Methods Declarations ************/
    /**
     * Signup the user and registered into the DB.
     * @param signupForm
     */
    vm.submitSignUpForm = function(signupForm) {
        // 1. Check form is valid
        if (signupForm.$valid) {

            // 2. Prepare user data
            let params = {
                name: vm.signUpUser.name,
                email: vm.signUpUser.email,
                password: vm.signUpUser.password,
                isAdmin: vm.signUpUser.isAdmin,
                status: 1 // -1 for Deleted, 0 for Inactive/Draft, 1 for Active/Publish, 2 for Sent, 3 for Pause
            };

            // 3. Call api to save user details
            let userService = new UsersService();
            userService.signup(params).then(function (response) {

                // 4. Show success notification
                Notification.success({
                    message: 'User registered successfully',
                    title: 'Success Notification'
                });

                // 5. Redirect to login page.
                setTimeout(function () {
                    $state.go('login');
                }, 500);
            });
        } else {
            // 1.1 Show error if form in invalid
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    /**
     * Signin the user
     *
     * @param signInForm
     */
    vm.submitSignInForm = function(signInForm) {
        //1. Check form is valid
        if (signInForm.$valid) {

            //2. Prepare user data
            let params = {
                email: vm.signInUser.email,
                password: vm.signInUser.password
            };

            //3. Call login api, check user with email and password is correct or not
            let userService = new UsersService();
            userService.signIn(params).then(function (response) {
                //4. If email and password is correct
                if (response.success) {
                    //4.1 Show success notification
                    Notification.success({
                        message: 'User logged in successfully',
                        title: 'Success Notification'
                    });

                    //4.2 Redirect to home page
                    setTimeout(function () {
                        $window.location.href = '/';
                    }, 500);
                } else {
                    //4.1 Show Error notification that email and password is incorrect
                    Notification.error({
                        message: response.message,
                        title: 'Error Notification'
                    });
                }

            });
        } else {
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    /****************** Controller Initialization ************/
    function init() {
        console.log('--> | Initialized the UserController...');
    }


    // Starting point of ctrl.
    init();
}]);