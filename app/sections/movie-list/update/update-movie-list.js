'use strict';

var app = angular.module('myApp.movieList');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('updateMovieList', {
        url: '/movie_lists/:movieListId',
        params: {
            destinationState: {name: 'movie_lists'},
            movieListId: null,
            edit: true
        },
        views: {
            "main": {
                templateUrl: 'sections/movie-list/update/update-movie-list.html',
                controller: 'UpdateMovieListCtrl'
            }
        }
    });
}]);

app.controller('UpdateMovieListCtrl', ['$scope', '$state', 'UiUtil', 'MovieListRepository', 'UserRepository', function ($scope, $state, UiUtil, MovieListRepository, UserRepository) {

    $scope.init = function () {
        $scope.UiUtil = UiUtil;
        $scope.refresh();
        $scope.whileEditing = $state.params.edit;
    };

    $scope.refresh = function () {
        MovieListRepository.getById($state.params.movieListId).then(function (data) {
            $scope.data = data;
            $scope.editableUsers = [];
            angular.forEach($scope.data.editableUsers, function (item) {
                $scope.editableUsers.push(item.user);
            });
        });
    };

    $scope.selectMovie = function (movie) {
        $scope.movieSearch = null;
        $scope.data.addMovie(movie);
    };

    $scope.removeMovie = function (movie) {
        $scope.data.removeMovie(movie);
    };

    $scope.onEditableUsersChange = function () {
        $scope.data.editableUsers = [];
        angular.forEach($scope.editableUsers, function (user) {
            $scope.data.addEditableUser(user);
        });
    };

    $scope.save = function (data) {
        MovieListRepository.update(data).then(function (updatedData) {
            data = updatedData;
            $scope.goBack();
        });
    };

    $scope.delete = function (data) {
        MovieListRepository.delete(data).then(function () {
            $scope.goBack();
        });
    };

    $scope.goBack = function () {
        if ($state.params.destinationState) {
            $state.go($state.params.destinationState.name, {}, {reload: true});
        }
    }

}]);