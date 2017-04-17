'use strict';

var app = angular.module('myApp.movie');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('updatemovie', {
        url: '/movies/:movieId',
        params: {
            destinationState: {name: 'movies'},
            movieId: null,
            edit: true
        },
        views: {
            "main": {
                templateUrl: 'sections/movie/update/update-movie.html',
                controller: 'UpdateMovieCtrl'
            }
        }
    });
}]);

app.controller('UpdateMovieCtrl', ['$scope', '$state', 'MovieRepository', function ($scope, $state, MovieRepository) {

    $scope.init = function () {
        $scope.refresh();
        $scope.whileEditing = $state.params.edit;
    };

    $scope.refresh = function () {
        MovieRepository.getById($state.params.movieId).then(function (movie) {
            $scope.movie = movie;
        });
    };

    $scope.setWatched = function (movie) {
        MovieRepository.setWatched(movie, movie.ownWatched.value).then(function (updatedMovie) {
            $scope.movie = updatedMovie;
        });
    };

    $scope.setRating = function (movie, value) {
        MovieRepository.setRating(movie, value).then(function (updatedMovie) {
            $scope.movie = updatedMovie;
            $scope.movie.oldAverageRating = updatedMovie.averageRating;
        });
    };

    $scope.postComment = function (movie, comment) {
        MovieRepository.postComment(movie, comment).then(function (updatedMovie) {
            angular.extend($scope.movie, updatedMovie);
            $scope.movie.currentComment = '';
        });
    };

    $scope.deleteComment = function (movie, comment) {
        MovieRepository.deleteComment(movie, comment).then(function (updatedMovie) {
            angular.extend($scope.movie, updatedMovie);
        });
    };

    $scope.save = function (movie) {
        MovieRepository.update(movie).then(function (updatedMovie) {
            $scope.movie = updatedMovie;
            $scope.goBack();
        });
    };

    $scope.delete = function (movie) {
        MovieRepository.delete(movie).then(function (deletedMovie) {
            $scope.goBack();
        });
    };

    $scope.goBack = function () {
        var destinationState = $state.params.destinationState;
        if (destinationState) {
            $state.go(destinationState.name, destinationState.params, {reload: true});
        }
    }

}]);