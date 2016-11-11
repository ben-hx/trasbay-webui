'use strict';

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
]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]).run(['$rootScope', 'cfpLoadingBar', 'AuthenticationService', function ($rootScope, cfpLoadingBar, AuthenticationService) {
    cfpLoadingBar.start();
    AuthenticationService.initialize();
}]);
