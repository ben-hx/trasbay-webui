'use strict';

var app = angular.module('myApp.landingpage', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/landingpage', {
        templateUrl: 'services/landingpage/landingpage.html',
        controller: 'LandingPageCtrl'
    });
}]);

app.controller('LandingPageCtrl', ['$scope', '$location', 'LoginViewManager', function ($scope, $location, LoginViewManager) {

    $scope.login = function () {
        LoginViewManager.login().then(function () {
            $location.path('home');
        }, function () {
            $location.path('landingpage');
        });
    };

}]);