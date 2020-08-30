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
            templateUrl: 'views/movie/list.html'
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

/*//Setting HTML5 Location Mode
angular.module('imdbApp').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);*/
