'use strict';

var app = angular.module('myApp.landingpage', ['ui.bootstrap', 'myApp.login']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('landing', {
        url: '/landing',
        views: {
            "main": {
                templateUrl: 'sections/landingpage/landingpage.html',
                controller: 'LandingPageCtrl'
            }
        },
    });
}]);

app.controller('LandingPageCtrl', ['$scope', '$state', 'LoginViewManager', function ($scope, $state, LoginViewManager) {
    $scope.login = function () {
        LoginViewManager.login();
    };
}]);