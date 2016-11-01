'use strict';

var app = angular.module('myApp.movie', ['ngRoute', 'myApp.model']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/movies', {
        templateUrl: 'sections/movie/movie.html',
        controller: 'MovieCtrl'
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