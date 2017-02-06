'use strict';

angular.module('myApp', [
    'ngAnimate',
    'duScroll',
    'angular-loading-bar',
    'ui.router',
    'myApp.config',
    'myApp.directives',
    'myApp.splashscreen',
    'myApp.navigation',
    'myApp.searchbar',
    'myApp.temp',
    'myApp.error',
    'myApp.model',
    'myApp.authentication',
    'myApp.landingpage',
    'myApp.movie',
    'myApp.admin',
]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]).run(['$rootScope', 'cfpLoadingBar', 'AuthenticationService', function ($rootScope, cfpLoadingBar, AuthenticationService) {
    AuthenticationService.initialize();
    cfpLoadingBar.start();
}]);
