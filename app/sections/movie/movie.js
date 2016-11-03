'use strict';

var app = angular.module('myApp.movie', ['myApp.model']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('movies', {
        url: '/movies',
        views: {
            "main": {
                templateUrl: 'sections/movie/movie.html',
                controller: 'MovieCtrl'
            }
        }
    });
}]);

app.controller('MovieCtrl', ['$scope', '$timeout', 'MovieRepository', function ($scope, $timeout, MovieRepository) {

    $scope.loadData = function () {
        MovieRepository.getAll().then(function (movies) {
            $scope.movies = movies;
        });
    };

    $scope.loadData();

}]);