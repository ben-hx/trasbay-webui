'use strict';

var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
};

var app = angular.module('myApp', [
    'ngAnimate',
    'duScroll',
    'angular-loading-bar',
    'ui.router',
    'yaru22.angular-timeago',
    'myApp.config',
    'myApp.directives',
    'myApp.splashscreen',
    'myApp.navigation',
    'myApp.searchbar',
    'myApp.temp',
    'myApp.error',
    'myApp.model',
    'myApp.errorHandler',
    'myApp.authentication',
    'myApp.home',
    'myApp.landingpage',
    'myApp.movie',
    'myApp.movieList',
    'myApp.user',
    'myApp.uiUtil'
]);
app.config(['$qProvider', 'cfpLoadingBarProvider', function ($qProvider, cfpLoadingBarProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    cfpLoadingBarProvider.includeSpinner = false;
}]);
app.run(['$rootScope', 'cfpLoadingBar', 'AuthenticationService', 'UiUtil', function ($rootScope, cfpLoadingBar, AuthenticationService, UiUtil) {
    AuthenticationService.initialize();
    UiUtil.initialize();
    cfpLoadingBar.start();
}]);
app.value('duScrollEasing', EasingFunctions.easeInOutQuad);