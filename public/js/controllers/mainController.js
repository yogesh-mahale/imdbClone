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