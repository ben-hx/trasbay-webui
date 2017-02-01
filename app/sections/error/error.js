'use strict';

var app = angular.module('myApp.landingpage', ['ui.bootstrap']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('error', {
        url: '/error',
        views: {
            "main": {
                templateUrl: 'sections/error/error.html',
                controller: 'ErrorCtrl'
            }
        },
        params: {
            error: {
                value: null,
                squash: true
            }
        },
    });
}]);

app.controller('ErrorCtrl', ['$scope', '$state', 'VestigalError', function ($scope, $state, VestigalError) {

    $scope.init = function () {
        $scope.error = $state.params.error;
        if (!$scope.error) {
            $scope.error = VestigalError.build();
        }
    }

}]);