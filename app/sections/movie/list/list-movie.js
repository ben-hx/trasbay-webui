'use strict';

var app = angular.module('myApp.movie');

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('movies', {
        url: '/movies?' +
        '{page:int}&' +
        '{limit:int}&' +
        '{sort:string}&' +
        '{title:string}&' +
        '{createdFrom:date}&{createdTo:date}&' +
        '{lastModifiedFrom:date}&{lastModifiedTo:date}&' +
        '{yearFrom:int}&{yearTo:int}&' +
        '{averageRatingFrom:int}&{averageRatingTo:int}&' +
        '{genres:array}&' +
        '{actors:array}&' +
        '{tags:array}&',
        views: {
            "main": {
                templateUrl: 'sections/movie/list/list-movie.html',
                controller: 'MovieListCtrl'
            },
            "filter@movies": {
                templateUrl: 'sections/movie/filter/filter-movie.html',
                controller: 'MovieFilterCtrl'
            },
        },
        params: {
            page: {
                value: 0,
                squash: true
            },
            limit: {
                value: 12,
                squash: true
            },
            sort: {
                value: 'title',
                squash: true

            },
            title: {
                value: '',
                squash: true
            },
            createdFrom: {
                value: null,
                squash: true
            },
            createdTo: {
                value: null,
                squash: true
            },
            lastModifiedFrom: {
                value: null,
                squash: true
            },
            lastModifiedTo: {
                value: null,
                squash: true
            },
            yearFrom: {
                value: null,
                squash: true
            },
            yearTo: {
                value: null,
                squash: true
            },
            averageRatingFrom: {
                value: null,
                squash: true
            },
            averageRatingTo: {
                value: null,
                squash: true
            },
            genres: {
                array: true,
                value: [],
                squash: true
            },
            actors: {
                array: true,
                value: [],
                squash: true
            },
            tags: {
                array: true,
                value: [],
                squash: true
            }
        },
        reloadOnSearch: false,
    });
}]);

app.controller('MovieListCtrl', ['$scope', '$state', '$stateParams', '$window', '$timeout', '$document', 'UiUtil', 'MovieRepository', 'MovieFilterService', 'SearchbarService', function ($scope, $state, $stateParams, $window, $timeout, $document, UiUtil, MovieRepository, MovieFilterService, SearchbarService) {

    $scope.init = function () {
        $scope.reload();
        $scope.UiUtil = UiUtil;
        SearchbarService.show = true;
    };

    $scope.updateFromSearchEvents = function () {
        $scope.reloadWithParams(MovieFilterService.data);
    };

    $scope.$on('searchbarSubmitted', $scope.updateFromSearchEvents);
    $scope.$on('movieFilterSubmitted', $scope.updateFromSearchEvents);

    $scope.$on('searchbarChanged', function (events, args) {
        MovieFilterService.data.title = SearchbarService.data.searchText;
    });

    $scope.$on('movieFilterChanged', function (events, args) {
        SearchbarService.data.searchText = MovieFilterService.data.title;
    });

    $scope.$on('movieFilterCleared', function (events, args) {
        SearchbarService.data.searchText = '';
        $scope.updateFromSearchEvents();
    });

    $scope.$on('movieFilterClosed', function (events, args) {
        SearchbarService.settings.isOpen = false;
    });

    $scope.$on('searchbarOpened', function (events, args) {
        MovieFilterService.settings.isOpen = true;
    });

    $scope.$on('searchbarClosed', function (events, args) {
        MovieFilterService.settings.isOpen = false;
    });

    $scope.reloadWithParams = function (params) {
        $scope.reload();
        $state.transitionTo($state.current.name, params);
    };

    $scope.reload = function () {
        MovieFilterService.data = $stateParams;
        MovieRepository.getAll($stateParams).then(function (data) {
            $scope.movies = data.movies;
            $scope.totalItems = data.pagination.totalCount;
            $scope.currentPage = data.pagination.page + 1;
        });

        $scope.showMovieFullInfo = false;
    };

    $scope.update = function (index) {
        var movie = $scope.movies[index];
        var destinationState = {name: 'movies'};
        $state.go('updatemovie', {movieId: movie.id, destinationState: destinationState}, {reload: true});
    };

    $scope.setWatched = function (index) {
        var movie = $scope.movies[index];
        console.log(movie.ownWatched.value);
        MovieRepository.setWatched(movie, movie.ownWatched.value).then(function (updatedMovie) {
            angular.extend($scope.movies[index], updatedMovie);
        }).catch(function () {
            movie.ownWatched.value = !movie.ownWatched.value;
        });
    };

    $scope.setRating = function (index, value) {
        var movie = $scope.movies[index];
        if ($scope.isMovieRateable(movie)) {
            MovieRepository.setRating(movie, value).then(function (updatedMovie) {
                angular.extend($scope.movies[index], updatedMovie);
                $scope.movies[index].oldAverageRating = updatedMovie.averageRating;
            });
        }
    };

    $scope.postComment = function (index, comment) {
        var movie = $scope.movies[index];
        MovieRepository.postComment(movie, comment).then(function (updatedMovie) {
            angular.extend($scope.movies[index], updatedMovie);
            $scope.movies[index].currentComment = '';
        });
    };

    $scope.deleteComment = function (index, comment) {
        var movie = $scope.movies[index];
        MovieRepository.deleteComment(movie, comment).then(function (updatedMovie) {
            angular.extend($scope.movies[index], updatedMovie);
        });
    };

    $scope.ratingHover = function (movie, value) {
        if ($scope.isMovieRateable(movie)) {
            movie.showRatingToolTip = true;
        }
    };

    $scope.isMovieRateable = function (movie) {
        return movie.ownWatched.value == true;
    };

    $scope.pageChanged = function (nextPage) {
        MovieFilterService.data.page = nextPage - 1;
        $scope.reloadWithParams(MovieFilterService.data);
    };

    $scope.scrollTo = function (id, top) {
        $timeout(function () {
            var element = angular.element(document.getElementById(id));
            $document.scrollToElementAnimated(element, top);
        }, 1);
    };

    $scope.showFullInfo = function ($event, movie, id) {
        movie.showFullInfo = true;
        var top = $event.target.getBoundingClientRect().top;
        $scope.scrollTo(id, top);
    };

    $scope.showPartInfo = function ($event, movie, id) {
        movie.showFullInfo = false;
        var top = $event.target.getBoundingClientRect().top;
        $scope.scrollTo(id, top);
    }

}]);