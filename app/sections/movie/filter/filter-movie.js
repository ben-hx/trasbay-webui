'use strict';

var app = angular.module('myApp.movie');

app.service('MovieFilterService', function () {

    return {
        data: {},
        settings: {},
        clear: function () {
            this.data = {}
        }
    };
});


app.config(['$provide', function ($provide) {
    $provide.decorator('MovieFilterService', ['$delegate', '$cookieStore', 'EventHandler', function ($delegate, $cookieStore, EventHandler) {

        var dataKey = "MovieFilterData";
        var settingsKey = "MovieFilterSettings";

        var load = function () {
            $delegate.data = $cookieStore.get(dataKey) || {};
            $delegate.settings = $cookieStore.get(settingsKey) || {};
        };

        var save = function () {
            $cookieStore.put(dataKey, $delegate.data);
            $cookieStore.put(settingsKey, $delegate.settings);
        };

        EventHandler.subscribe('movieFilterSubmitted', save);
        EventHandler.subscribe('movieFilterCleared', save);
        EventHandler.subscribe('movieFilterClosed', save);

        var initialize = function () {
            load();
        };

        initialize();

        return $delegate;
    }]);
}]);

app.controller('MovieFilterCtrl', ['$scope', 'EventHandler', 'MovieRepository', 'MovieFilterService', function ($scope, EventHandler, MovieRepository, MovieFilterService) {

    $scope.init = function () {
        $scope.MovieFilterService = MovieFilterService;
        MovieRepository.getGenres().then(function (result) {
            $scope.genres = result.genres;
        });
        MovieRepository.getActors().then(function (result) {
            $scope.actors = result.actors;
        });
        MovieRepository.getTags().then(function (result) {
            $scope.tags = result.tags;
        });
    };

    $scope.filterOnChange = function () {
        EventHandler.emit('movieFilterChanged', MovieFilterService.data);
    };

    $scope.filterOnSubmit = function () {
        EventHandler.emit('movieFilterSubmitted', MovieFilterService.data);
    };

    $scope.filterOnClear = function () {
        MovieFilterService.clear();
        EventHandler.emit('movieFilterCleared', MovieFilterService.data);
    };

    $scope.filterOnClose = function () {
        MovieFilterService.settings.isOpen = false;
        EventHandler.emit('movieFilterClosed', MovieFilterService.data);
    };

}]);