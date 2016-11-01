'use strict';

var app = angular.module('myApp.add-movie', ['ngRoute', 'myApp.model']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/addmovie', {
        templateUrl: 'sections/movie/add-movie/add-movie.html',
        controller: 'AddMovieCtrl'
    });
}]);

app.controller('AddMovieCtrl', ['$scope', '$timeout', 'MovieRepository', function ($scope, $timeout, MovieRepository) {

    $scope.loadData = function () {
        MovieRepository.getAll().then(function (movies) {
            $scope.movies = movies;
        });
    };

    $scope.loadData();

}]);