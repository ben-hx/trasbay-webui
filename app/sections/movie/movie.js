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
            $scope.extendMoviesWithRating(movies);
            $scope.extendMoviesWithWatched(movies);
        });
    };
    $scope.reload();

    $scope.update = function (movie) {
        var destinationState = {name: 'movies'};
        $state.go('updatemovie', {movieId: movie.id, destinationState: destinationState}, {reload: true});
    };

    $scope.extendMoviesWithRating = function (movies) {
        angular.forEach(movies, function (movie) {
            MovieRepository.getRating(movie).then(function (data) {
                movie = angular.extend(movie, data);
                movie.oldAverageRating = data.averageRating;
            });
        });
    };

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

    $scope.setRating = function (movie, value) {
        if ($scope.isMovieRateable(movie)) {
            MovieRepository.setRating(movie, value).then(function (data) {
                movie.ownRating = data.ownRating;
                movie.oldAverageRating = data.averageRating;
            });
        }
    };

    $scope.ratingOnLeave = function (movie) {
        movie.averageRating = movie.oldAverageRating;
    };

    $scope.isMovieRateable = function (movie) {
        return movie.hasWatched == true;
    };

}]);