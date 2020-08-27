var app = angular.module('imdbApp', ['ngResource', 'ui.router', 'ngSanitize', 'ui.bootstrap',  'ngMessages', 'ngRoute']);





/*var app = angular.module('zogataApp', ['ngCookies', 'ui.mention', 'ngResource', 'ui.router', 'ui.tinymce', 'ui.tiny', 'ngFileUpload', 'ngAnimate', 'ngTagsInput','ngDragDrop', 'dragularModule', 'ui-notification', 'ngSanitize', 'ngAria','moment-picker', 'ngMessages', 'ui.bootstrap', 'ngBootstrap', 'ui.route', 'multi-auto-complete', 'ngScrollbars', 'zogataApp.system', 'zogataApp.auth', 'zogataApp.notification', 'zogataApp.reminder', 'zogataApp.notebook', 'zogataApp.chat', 'zogataApp.contact', 'zogataApp.opportunity', 'zogataApp.task','zogataApp.company', 'zogataApp.tickets', 'chart.js', 'angularjs-gauge', 'btford.socket-io', 'isteven-multi-select', 'zogataApp.webSurvey', 'zogataApp.emailSurvey', 'zogataApp.npsSurvey', 'zogataApp.cesSurvey', 'zogataApp.csatSurvey', 'zogataApp.survey', 'zogataApp.workflow', 'zogataApp.ecommerce', 'zogataApp.funnel', 'mentio','angularMoment']);*/

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


