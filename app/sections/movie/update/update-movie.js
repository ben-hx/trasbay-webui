'use strict';

var app = angular.module('myApp.movie');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('updatemovie', {
        url: '/movies/:movieId',
        params: {
            destinationState: {name: 'movies'},
            movieId: null
        },
        views: {
            "main": {
                templateUrl: 'sections/movie/update/update-movie.html',
                controller: 'UpdateMovieCtrl'
            }
        }
    });
}]);

app.controller('UpdateMovieCtrl', ['$scope', '$state', 'MovieRepository', 'NotificationService', 'ConfirmationViewManager', function ($scope, $state, MovieRepository, NotificationService, ConfirmationViewManager) {

    $scope.init = function () {
        $scope.refresh();
        $scope.whileEditing = true;
    };

    $scope.refresh = function () {
        MovieRepository.getById($state.params.movieId).then(function (movie) {
            $scope.movie = movie;
        });
    };

    $scope.setWatched = function (movie) {
        MovieRepository.setWatched(movie, movie.ownWatched.value).then(function (updatedMovie) {
            movie = updatedMovie;
        });
    };

    $scope.setRating = function (movie, value) {
        if ($scope.isMovieRateable(movie)) {
            MovieRepository.setRating(movie, value).then(function (updatedMovie) {
                movie = updatedMovie;
                movie.oldAverageRating = updatedMovie.averageRating;
            });
        }
    };

    $scope.isMovieRateable = function (movie) {
        if (!movie) {
            return false;
        }
        return movie.ownWatched.value == true;
    };

    $scope.save = function (movie) {
        MovieRepository.update(movie).then(function (updatedMovie) {
            movie = updatedMovie;
            $scope.goBack();
        });
    };

    $scope.delete = function (movie) {
        MovieRepository.delete(movie).then(function (deletedMovie) {
            $scope.goBack();
        });
    };

    $scope.goBack = function () {
        if ($state.params.destinationState) {
            $state.go($state.params.destinationState.name, {}, {reload: true});
        }
    }

}]);