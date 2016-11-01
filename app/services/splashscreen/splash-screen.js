var app = angular.module('myApp.splashscreen', []);


app.controller('SplashScreenCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

    var splashScreenDisplayTime = 500;

    $scope.onInit = function () {
        $timeout(function () {
            $scope.hideScreen = true;
        }, splashScreenDisplayTime);
    }

}]);