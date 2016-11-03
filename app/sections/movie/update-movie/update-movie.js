'use strict';

var app = angular.module('myApp.update-movie', ['myApp.model', 'ui.bootstrap', 'ngTagsInput']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('updatemovie', {
        url: '/movies/:movieId',
        params: {
            destinationState: null
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
            $scope.movie = movie;
        });
    };

    $scope.reload();

    $scope.getPosterUrl = function (movie) {
        if (movie) {
            return movie.poster;
        }
        return 'http://placehold.it/700x300';
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
            MovieRepository.create($scope.viewDataToModel(movie)).then(function () {
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
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup = {
        opened: false
    };

}]);