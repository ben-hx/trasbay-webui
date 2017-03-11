'use strict';

var app = angular.module('myApp.authentication', ['myApp.basic-authentication']);

app.service('AuthenticationService', ['BasicAuthenticationService', function (BasicAuthenticationService) {
    var currentAuthenticationService = BasicAuthenticationService;

    return {
        login: currentAuthenticationService.login,
        register: currentAuthenticationService.register,
        getLoggedInUser: currentAuthenticationService.getLoggedInUser,
        isLoggedIn: currentAuthenticationService.isLoggedIn,
        isInAnyRole: currentAuthenticationService.isInAnyRole,
        logout: currentAuthenticationService.logout,
        initialize: currentAuthenticationService.initialize
    };
}]);