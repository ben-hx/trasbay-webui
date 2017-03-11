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
    $provide.decorator('MovieFilterService', ['$delegate', '$cookieStore', '$rootScope', function ($delegate, $cookieStore, $rootScope) {

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

        $rootScope.$on('movieFilterSubmitted', save);
        $rootScope.$on('movieFilterCleared', save);
        $rootScope.$on('movieFilterClosed', save);

        var initialize = function () {
            load();
        };

        initialize();

        return $delegate;
    }]);
}]);

app.controller('MovieFilterCtrl', ['$scope', '$rootScope', 'MovieRepository', 'MovieFilterService', function ($scope, $rootScope, MovieRepository, MovieFilterService) {

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
        $rootScope.$broadcast('movieFilterChanged', MovieFilterService.data);
    };

    $scope.filterOnSubmit = function () {
        $rootScope.$broadcast('movieFilterSubmitted', MovieFilterService.data);
    };

    $scope.filterOnClear = function () {
        MovieFilterService.clear();
        $rootScope.$broadcast('movieFilterCleared', MovieFilterService.data);
    };

    $scope.filterOnClose = function () {
        MovieFilterService.settings.isOpen = false;
        $rootScope.$broadcast('movieFilterClosed', MovieFilterService.data);
    };

}]);