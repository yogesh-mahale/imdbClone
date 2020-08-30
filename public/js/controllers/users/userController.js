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