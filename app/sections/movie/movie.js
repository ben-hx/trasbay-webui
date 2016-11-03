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

app.controller('MovieCtrl', ['$scope', '$state', 'MovieRepository', function ($scope, $state, MovieRepository) {

    $scope.reload = function () {
        MovieRepository.getAll().then(function (movies) {
            $scope.movies = movies;
            $scope.extendMoviesWithWatched(movies);
        });
    };

    $scope.update = function (movie) {
        var destinationState = {name: 'movies'};
        $state.go('updatemovie', {movieId: movie.id, destinationState: destinationState}, {reload: true});
    };

    $scope.reload();

    $scope.extendMoviesWithWatched = function (movies) {
        angular.forEach(movies, function (movie) {
            MovieRepository.getWatched(movie).then(function (data) {
                movie = angular.extend(movie, data);
            });
        });
    };

    $scope.setWatched = function (movie) {
        MovieRepository.setWatched(movie, movie.hasWatched).then(function (data) {
            movie.hasWatched = data.hasWatched;
            movie.hasWatched ? movie.usersWatched++ : movie.usersWatched--;
        });
    };

}]);