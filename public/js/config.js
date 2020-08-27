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
        .state('404',{
            url : '/404',
            templateUrl: 'views/404.html'
        });
}]);

/*//Setting HTML5 Location Mode
angular.module('imdbApp').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);*/
