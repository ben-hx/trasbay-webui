'use strict';

var app = angular.module('myApp.add-movie', ['myApp.model', 'ui.bootstrap', 'ngTagsInput']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addmovie', {
        url: '/addmovie',
        views: {
            "main": {
                templateUrl: 'sections/movie/add-movie/add-movie.html',
                controller: 'AddMovieCtrl'
            }
        }
    });
}]);

app.controller('AddMovieCtrl', ['$scope', '$timeout', '$state', 'MovieDatabaseRepository', 'MovieRepository', function ($scope, $timeout, $state, MovieDatabaseRepository, MovieRepository) {

    $scope.getTitle = function(searchText) {
        return MovieDatabaseRepository.getShortMoviesByText(searchText).then(function (shortMovies) {
            return shortMovies;
        });
    };

    $scope.titleOnSelect = function(shortMovie) {
        return MovieDatabaseRepository.getByImdbId(shortMovie.imdbId).then(function (movie) {
            $scope.fillModel(movie);
        });
    };

    $scope.fillModel = function(movie) {
        $scope.movie = movie;
        $scope.movie.year = new Date(movie.year);
    };

    $scope.getPoster = function(movie) {
        if (movie) {
            return movie.poster;
        }
        return 'http://placehold.it/700x300';
    };

    $scope.viewDataToModel = function(viewData) {
        var result = viewData;
        result.genres = result.genres.map(function(data) { return data.text; });
        result.directors = result.directors.map(function(data) { return data.text; });
        result.writers = result.writers.map(function(data) { return data.text; });
        result.actors = result.actors.map(function(data) { return data.text; });
        result.languages = result.languages.map(function(data) { return data.text; });
        result.year = result.year.getYear();
        return result;
    };

    $scope.save = function(movie) {
        if (movie) {
            MovieRepository.create($scope.viewDataToModel(movie)).then(function () {
                $state.go('^', {}, {reload: true});
            });
        }
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        showWeeks: false,
        minMode: 'year',
        datepickerMode:'year',
        currentText: 'This Year'
    };

    $scope.open = function() {
        $scope.popup.opened = true;
    };

    $scope.formats = ['yyyy'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup = {
        opened: false
    };


}]);