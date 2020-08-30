var app = angular.module('imdbApp', ['ngCookies', 'ngResource', 'ui.router', 'ngSanitize', 'ui.bootstrap',  'ngMessages', 'ngRoute', 'ngAnimate', 'isteven-multi-select',
    'ui-notification', 'imdbApp.system', 'imdbApp.auth', 'imdbApp.user']);

angular.module('imdbApp.system', []);
angular.module('imdbApp.auth', []);
angular.module('imdbApp.user', []);
