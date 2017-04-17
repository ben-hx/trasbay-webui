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
        '{tags:array}',
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
                value: 15,
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

app.controller('MovieListCtrl', ['$scope', '$state', '$stateParams', '$window', '$timeout', '$document', 'EventHandler', 'UiUtil', 'MovieRepository', 'MovieFilterService', 'SearchbarService', function ($scope, $state, $stateParams, $window, $timeout, $document, EventHandler, UiUtil, MovieRepository, MovieFilterService, SearchbarService) {

    $scope.init = function () {
        $scope.UiUtil = UiUtil;
        $scope.initSettingsAndData();
        $scope.sort = {
            items: [
                {name: 'title', caption: 'title'},
                {name: 'averageRating', caption: 'average rating'},
                {name: 'year', caption: 'year'},
                {name: 'created', caption: 'created'}
            ]
        };
        $scope.sort.field = $scope.extractSortFieldFromParams($stateParams);
        $scope.sort.order = $scope.extractSortOrderFromParams($stateParams);
        $scope.limit = {
            items: [
                {value: 15, caption: '15 per page'},
                {value: 25, caption: '25 per page'},
                {value: 50, caption: '50 per page'},
                {value: 100, caption: '100 per page'},
            ]
        };
        $scope.limit.field = $scope.extractLimitFieldFromParams($stateParams);
        MovieFilterService.settings.limit = $scope.limit.field.value;
        $scope.reload($stateParams);
    };

    $scope.initSettingsAndData = function () {
        SearchbarService.show = true;
        $scope.updateSearchbarFromMovieFilter();
        SearchbarService.settings.isOpen = SearchbarService.settings.isOpen || MovieFilterService.settings.isOpen;
        MovieFilterService.settings.isOpen = SearchbarService.settings.isOpen || MovieFilterService.settings.isOpen;
    };


    $scope.limitBy = function (item) {
        if (item.name == $scope.limit.field.value) {
            return
        }
        $scope.limit.field = item;
        MovieFilterService.data.page = 0;
        MovieFilterService.settings.limit = $scope.limit.field.value;
        $scope.updateFromSearchEvents();
    };

    $scope.extractLimitFieldFromParams = function (params) {
        var fieldValue = params.limit;
        var result = $scope.limit.items[0];
        angular.forEach($scope.limit.items, function (item) {
            if (item.value == fieldValue) {
                result = item;
            }
        });
        return result;
    };

    $scope.extractSortFieldFromParams = function (params) {
        var fieldName = params.sort;
        if (fieldName.substring(0, 1) == '-') {
            fieldName.substring(1, fieldName.length)
        }
        var result = $scope.sort.items[0];
        angular.forEach($scope.sort.items, function (value) {
            if (value == fieldName) {
                result = value;
            }
        });
        return result;
    };

    $scope.extractSortOrderFromParams = function (params) {
        if (params.sort.substring(0, 1) == '-') {
            return '-'
        }
        return '';
    };

    $scope.updateFromSearchEvents = function () {
        $scope.reloadWithParams(angular.extend({}, MovieFilterService.data, MovieFilterService.settings));
    };

    $scope.updateSearchbarFromMovieFilter = function () {
        SearchbarService.data.searchText = MovieFilterService.data.title;
    };

    $scope.updateMovieFilterFromSearchBar = function () {
        MovieFilterService.data.title = SearchbarService.data.searchText;
    };

    EventHandler.subscribe('searchbarSubmitted', $scope.updateFromSearchEvents);
    EventHandler.subscribe('movieFilterSubmitted', $scope.updateFromSearchEvents);
    EventHandler.subscribe('searchbarChanged', $scope.updateMovieFilterFromSearchBar);
    EventHandler.subscribe('movieFilterChanged', $scope.updateSearchbarFromMovieFilter);

    EventHandler.subscribe('movieFilterCleared', function (events, args) {
        SearchbarService.data.searchText = '';
        $scope.updateFromSearchEvents();
    });

    EventHandler.subscribe('movieFilterClosed', function (events, args) {
        SearchbarService.settings.isOpen = false;
    });

    EventHandler.subscribe('searchbarOpened', function (events, args) {
        MovieFilterService.settings.isOpen = true;
    });

    EventHandler.subscribe('searchbarClosed', function (events, args) {
        MovieFilterService.settings.isOpen = false;
    });

    $scope.filterIsOpen = function () {
        return MovieFilterService.settings.isOpen || SearchbarService.settings.isOpen;
    };

    $scope.reloadWithParams = function (params) {
        $state.transitionTo($state.current.name, params);
        $scope.reload(params);
    };

    $scope.reload = function (params) {
        $scope.whileLoading = true;
        MovieRepository.getAll(params).then(function (data) {
            $scope.whileLoading = false;
            $scope.movies = data.movies;
            $scope.totalItems = data.pagination.totalCount;
            $scope.currentPage = data.pagination.page + 1;
        });
        $scope.showMovieFullInfo = false;
    };

    $scope.sortBy = function (item) {
        if (item.name == $scope.sort.field.name) {
            $scope.sort.order = $scope.sort.order == '-' ? '' : '-';
        } else {
            $scope.sort.order = '';
        }
        $scope.sort.field = item;
        MovieFilterService.settings.sort = $scope.sort.order + $scope.sort.field.name;
        $scope.updateFromSearchEvents();
    };

    $scope.getCurrentStateWithParams = function () {
        return {
            name: $state.current.name,
            params: $stateParams
        }
    };

    $scope.add = function () {
        $state.go('addmovie', {destinationState: $scope.getCurrentStateWithParams()}, {reload: true});
    };

    $scope.update = function (index) {
        var movie = $scope.movies[index];
        $state.go('updatemovie', {movieId: movie.id, destinationState: $scope.getCurrentStateWithParams()});
    };

    $scope.setWatched = function (index) {
        var movie = $scope.movies[index];
        MovieRepository.setWatched(movie, movie.ownWatched.value).then(function (updatedMovie) {
            angular.extend($scope.movies[index], updatedMovie);
        }).catch(function () {
            movie.ownWatched.value = !movie.ownWatched.value;
        });
    };

    $scope.setRating = function (index, value) {
        var movie = $scope.movies[index];
        MovieRepository.setRating(movie, value).then(function (updatedMovie) {
            angular.extend($scope.movies[index], updatedMovie);
            $scope.movies[index].oldAverageRating = updatedMovie.averageRating;
        });
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
        $scope.updateFromSearchEvents();
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