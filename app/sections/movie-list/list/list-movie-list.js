'use strict';

var app = angular.module('myApp.movieList');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('movieLists', {
        url: '/movie_lists',
        views: {
            "main": {
                templateUrl: 'sections/movie-list/list/list-movie-list.html',
                controller: 'MovieListListCtrl'
            },
            "private@movieLists": {
                templateUrl: 'sections/movie-list/list/access.html',
                controller: 'MovieListAccessCtrl',
                resolve: {
                    access: function () {
                        return "private";
                    }
                }
            },
            "group@movieLists": {
                templateUrl: 'sections/movie-list/list/access.html',
                controller: 'MovieListAccessCtrl',
                resolve: {
                    access: function () {
                        return "group";
                    }
                }
            },
            "public@movieLists": {
                templateUrl: 'sections/movie-list/list/access.html',
                controller: 'MovieListAccessCtrl',
                resolve: {
                    access: function () {
                        return "public";
                    }
                }
            },
        },
        reloadOnSearch: false,
    });
}]);

app.controller('MovieListAccessCtrl', ['$scope', '$state', 'MovieListRepository', 'access', function ($scope, $state, MovieListRepository, access) {

    $scope.init = function () {
        $scope.reload();
    };

    $scope.reload = function () {
        $scope.whileLoading = true;
        MovieListRepository.getAll({access: access}).then(function (data) {
            $scope.whileLoading = false;
            $scope.lists = data.movieLists;
        });
    };

    $scope.update = function (index) {
        var data = $scope.lists[index];
        $state.go('updateMovieList', {movieListId: data.id, destinationState: $state.current});
    };

    $scope.show = function (index) {
        var data = $scope.lists[index];
        $state.go('updateMovieList', {
            movieListId: data.id,
            destinationState: $state.current,
            edit: false
        });
    };

    $scope.remove = function (index) {
        MovieListRepository.delete($scope.lists[index]).then(function (data) {
            $scope.lists.splice(index, 1);
        });
    };

}]);

app.controller('MovieListListCtrl', ['$scope', '$state', '$stateParams', 'MovieListRepository', function ($scope, $state, $stateParams, MovieListRepository) {

    $scope.init = function () {
        $scope.private = {
            open: true
        };
        $scope.group = {
            open: true
        };
        $scope.public = {
            open: true
        };
    };

    $scope.add = function () {
        $state.go('addMovieList', {destinationState: $state.current});
    };

}]);