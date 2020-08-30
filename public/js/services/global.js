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