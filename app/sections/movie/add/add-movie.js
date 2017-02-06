'use strict';

var app = angular.module('myApp.movie');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addmovie', {
        url: '/addmovie',
        params: {
            destinationState: {name: 'movies'}
        },
        views: {
            "main": {
                templateUrl: 'sections/movie/add/add-movie.html',
                controller: 'AddMovieCtrl'
            }
        }
    });
}]);

app.controller('AddMovieCtrl', ['$scope', '$state', 'MovieDatabaseRepository', 'MovieRepository', function ($scope, $state, MovieDatabaseRepository, MovieRepository) {

    $scope.getTitles = function (searchText) {
        return MovieDatabaseRepository.getShortMoviesByText(searchText).then(function (shortMovies) {
            return shortMovies;
        });
    };

    $scope.titleOnSelect = function (shortMovie, movieFromMovieDatabase) {
        $scope.movie = movieFromMovieDatabase;
        return MovieDatabaseRepository.getByImdbId(shortMovie.imdbId).then(function (movie) {
            $scope.fillModelFromMovieDatabase(movie);
        });
    };

    $scope.fillModelFromMovieDatabase = function (movie) {
        $scope.movie = movie;
        $scope.movie.year = new Date(movie.year);
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