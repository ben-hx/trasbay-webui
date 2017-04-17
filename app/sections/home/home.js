'use strict';

var app = angular.module('myApp.home', ['myApp.model', 'myApp.movie']);

app.config(['$stateProvider', function ($stateProvider) {
    var limit = 6;
    $stateProvider.state('privateHome', {
        url: '/privateHome',
        views: {
            "main": {
                templateUrl: 'sections/home/home.html',
                controller: 'HomeCtrl'
            },
            "recentlyCreatedMovies@privateHome": {
                templateUrl: 'sections/home/movie/movie.html',
                controller: 'MovieWithParamsCtrl',
                resolve: {
                    params: function () {
                        return {sort: '-created', limit: limit};
                    }
                }
            },
            "mostRatedMovies@privateHome": {
                templateUrl: 'sections/home/movie/movie.html',
                controller: 'MovieWithParamsCtrl',
                resolve: {
                    params: function () {
                        return {sort: '-averageRating', limit: limit};
                    }
                }
            },
        }
    });
}]);

app.controller('HomeCtrl', ['$scope', '$state', 'UiUtil', 'MovieRepository', function ($scope, $state, UiUtil, MovieRepository) {

    $scope.init = function () {
        $scope.UiUtil = UiUtil;
        $scope.recentlyCreatedMovies = {
            open: true
        };
        $scope.mostRatedMovies = {
            open: true
        }
    };

}]);