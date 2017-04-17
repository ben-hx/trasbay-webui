'use strict';

var app = angular.module('myApp.movieList');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addMovieList', {
        url: '/add_movie_list',
        views: {
            "main": {
                templateUrl: 'sections/movie-list/add/add-movie-list.html',
                controller: 'AddMovieListCtrl'
            }
        },
        params: {
            destinationState: {
                name: 'movieLists'
            }
        }
    });
}]);

app.controller('AddMovieListCtrl', ['$scope', '$state', 'MovieList', 'MovieListRepository', function ($scope, $state, MovieList, MovieListRepository) {

    $scope.init = function () {
        $scope.inputCollector = false;
        $scope.tooltips = {title: true};
        $scope.reset();
    };

    $scope.selectMovie = function (movie) {
        $scope.movieSearch = null;
        $scope.data.addMovie(movie);
    };

    $scope.removeMovie = function (movie) {
        $scope.data.removeMovie(movie);
    };

    $scope.hideTooltips = function () {
        $scope.tooltips = {title: false};
    };

    $scope.onEditableUsersChange = function () {
        $scope.data.editableUsers = [];
        angular.forEach($scope.editableUsers, function (user) {
            $scope.data.addEditableUser(user);
        });
    };

    $scope.save = function (data) {
        MovieListRepository.create(data).then(function () {
            $scope.reset();
            if (!$scope.inputCollector) {
                $scope.goBack();
            }
        });
    };

    $scope.reset = function () {
        $scope.data = new MovieList();
        $scope.editableUsers = [];
    };

    $scope.goBack = function () {
        if ($state.params.destinationState) {
            $state.go($state.params.destinationState.name, {}, {reload: true});
        }
    };

}]);