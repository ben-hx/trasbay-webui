'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngAnimate',
    'duScroll',
    'ui.router',
    'angular-loading-bar',
    'myApp.directives',
    'myApp.authentication',
    'myApp.navigation',
    'myApp.splashscreen',
    'myApp.login',
    'myApp.services',
    'myApp.movie',
    'myApp.add-movie',
    'myApp.update-movie',
    'myApp.landingpage',
    'myApp.config'
]).config(['RestangularProvider', 'cfpLoadingBarProvider', function (RestangularProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;

    RestangularProvider.setBaseUrl('http://localhost:8080/v1');

    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var extractedData;
        if (operation === "getList") {
            extractedData = data.data;
        } else if (operation === "get") {
            extractedData = data.data;
        } else {
            extractedData = data.data;
        }
        return extractedData;
    });
}]).run(['$rootScope', 'cfpLoadingBar', 'AuthenticationService', function ($rootScope, cfpLoadingBar, AuthenticationService) {

    cfpLoadingBar.start();
    AuthenticationService.initialize();

}]);
