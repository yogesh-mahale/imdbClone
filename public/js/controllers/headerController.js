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