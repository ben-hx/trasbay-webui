'use strict';

var app = angular.module('myApp.landingpage', ['ui.bootstrap']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('landingpage', {
        url: '/landingpage',
        views: {
            "main": {
                templateUrl: 'sections/landingpage/landingpage.html',
                controller: 'LandingPageCtrl'
            }
        }
    });
}]);

app.controller('LandingPageCtrl', ['$scope', '$location', 'LoginViewManager', function ($scope, $location, LoginViewManager) {

    $scope.login = function () {
        LoginViewManager.login().then(function () {
            $location.path('movies');
        }, function () {
            $location.path('landingpage');
        });
    };

}]);