'use strict';

var app = angular.module('myApp.login');

app.config(['$provide', function ($provide) {
    $provide.decorator('LoginViewManager', [
        '$delegate',
        '$state',
        function ($delegate, $state) {

            var navigationInterceptor = function (promise) {
                return promise.then(function (result) {
                    if (result.action == 'login') {
                        $state.go('home');
                    }
                });
            };

            var login = $delegate.login;
            $delegate.login = function () {
                return navigationInterceptor(login.apply($delegate, arguments))
            };

            var register = $delegate.register;
            $delegate.register = function () {
                return navigationInterceptor(register.apply($delegate, arguments))
            };
            return $delegate;
        }]);
}]);