'use strict';

var app = angular.module('myApp.update-movie', ['myApp.model', 'ui.bootstrap', 'ngTagsInput']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('updatemovie', {
        url: '/movies/:movieId',
        params: {
            destinationState: {name: 'movies'},
            movieId: null
        },
        views: {
            "main": {
                templateUrl: 'sections/movie/update-movie/update-movie.html',
                controller: 'UpdateMovieCtrl'
            }
        }
    });
}]);

app.controller('UpdateMovieCtrl', ['$scope', '$timeout', '$state', 'MovieRepository', function ($scope, $timeout, $state, MovieRepository) {

    $scope.reload = function () {
        MovieRepository.getById($state.params.movieId).then(function (movie) {
            $scope.movie = $scope.modelToViewData(movie);
            $scope.extendMovieWithRating(movie);
            $scope.extendMovieWithWatched(movie);
        });
    };
    $scope.reload();

    $scope.extendMovieWithRating = function (movie) {
        MovieRepository.getRating(movie).then(function (data) {
            movie = angular.extend(movie, data);
            movie.oldAverageRating = data.averageRating;
        });
    };

    $scope.extendMovieWithWatched = function (movie) {
        MovieRepository.getWatched(movie).then(function (data) {
            movie = angular.extend(movie, data);
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

    $scope.modelToViewData = function (movie) {
        var result = movie;
        result.year = new Date(movie.year);
        return result;
    };

    $scope.viewDataToModel = function (viewData) {
        var result = viewData;
        result.genres = result.genres.map(function (data) {
            return data.text;
        });
        result.directors = result.directors.map(function (data) {
            return data.text;
        });
        result.writers = result.writers.map(function (data) {
            return data.text;
        });
        result.actors = result.actors.map(function (data) {
            return data.text;
        });
        result.languages = result.languages.map(function (data) {
            return data.text;
        });
        result.year = result.year.getYear();
        return result;
    };

    $scope.save = function (movie) {
        if (movie) {
            MovieRepository.update($scope.viewDataToModel(movie)).then(function () {
                $state.go($state.params.destinationState.name, {}, {reload: true});
            });
        }
    };

    $scope.dateOptions = {
        startingDay: 1,
        showWeeks: false,
        minMode: 'year',
        datepickerMode: 'year',
        currentText: 'This Year'
    };

    $scope.open = function () {
        $scope.popup.opened = true;
    };

    $scope.formats = ['yyyy'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = 'yyyy';

    $scope.popup = {
        opened: false
    };

}]);