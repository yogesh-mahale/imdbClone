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


