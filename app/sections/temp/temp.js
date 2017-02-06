'use strict';

var app = angular.module('myApp.temp', []);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('temp', {
        url: '/temp',
        views: {
            "main": {
                templateUrl: 'sections/temp/temp.html',
                controller: 'TempCtrl'
            }
        },
        reloadOnSearch: false,
    });
}]);

app.controller('TempCtrl', ['$scope', '$state', '$window', function ($scope, $state, $window) {


}]);