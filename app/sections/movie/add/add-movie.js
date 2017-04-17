'use strict';

var app = angular.module('myApp.movie');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addmovie', {
        url: '/addmovie',
        views: {
            "main": {
                templateUrl: 'sections/movie/add/add-movie.html',
                controller: 'AddMovieCtrl'
            }
        },
        params: {
            destinationState: {
                name: 'movies'
            }
        }
    });
}]);

app.controller('AddMovieCtrl', ['$scope', '$state', 'MovieRepository', function ($scope, $state, MovieRepository) {

    $scope.init = function () {
        $scope.inputCollector = false;
        $scope.tooltips = {title: true};
    };

    $scope.hideTooltips = function () {
        $scope.tooltips = {title: false};
    };

    $scope.save = function (movie) {
        MovieRepository.create(movie).then(function () {
            $scope.reset();
            if (!$scope.inputCollector) {
                $scope.goBack();
            }
        });
    };

    $scope.reset = function () {
        $scope.movie = {};
    };

    $scope.goBack = function () {
        var destinationState = $state.params.destinationState;
        if (destinationState) {
            $state.go(destinationState.name, destinationState.params, {reload: true});
        }
    };

}]);