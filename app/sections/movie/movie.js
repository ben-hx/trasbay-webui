'use strict';

var app = angular.module('myApp.movie', ['myApp.model']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('movies', {
        url: '/movies?page&limit&sort&title',
        views: {
            "main": {
                templateUrl: 'sections/movie/movie.html',
                controller: 'MovieCtrl'
            }
        },
        params: {
            page: {
                value: '0',
                squash: true
            },
            limit: {
                value: '12',
                squash: true
            },
            sort: {
                value: 'title',
                squash: true

            },

            title: {
                value: '',
                squash: true
            }
        },
        reloadOnSearch: false,
    });
}]);

app.controller('MovieCtrl', ['$scope', '$state', '$window', 'MovieRepository', 'SearchbarService', function ($scope, $state, $window, MovieRepository, SearchbarService) {

    SearchbarService.showSearchbar = true;

    $scope.updateFromSearchEvents = function (events, args) {
        if ($scope.searchHasChanged) {
            $scope.reloadWithParams({
                title: args.searchText,
                sort: ''
            });
            $scope.searchHasChanged = false;
        }
    };
    $scope.$on('searchbarChanged', function (events, args) {
        $scope.searchHasChanged = true;
    });
    $scope.$on('searchbarSubmitted', $scope.updateFromSearchEvents);
    $scope.$on('searchbarCleared', $scope.updateFromSearchEvents);


    $scope.rearrangeMovieToPartInfo = function ($index) {
        if ($scope.movies[$index].showFullInfo) {
            $scope.movies[$index].showFullInfo = false;
            var elementA = $scope.movies[$index];
            var elementB = $scope.movies[elementA.originalIndex];
            $scope.movies[$index] = elementB;
            $scope.movies[elementA.originalIndex] = elementA;
            $scope.showMovieFullInfo = false;
            $scope.showMovieFullInfoIndex = -1;
        }
    };

    $scope.rearrangeMovieToFullInfo = function ($index) {
        if (!$scope.showMovieFullInfo) {
            $scope.movies[$index].showFullInfo = true;
            $scope.movies[$index].originalIndex = $index;
            var stripNumber = ($index % $scope.findColNumberPerRow());
            if (stripNumber > 0) {
                var elementA = $scope.movies[$index];
                var elementB = $scope.movies[$index - stripNumber];
                $scope.movies[$index] = elementB;
                $scope.movies[$index - stripNumber] = elementA;
            }
            $scope.showMovieFullInfo = true;
            $scope.showMovieFullInfoIndex = $index - stripNumber;
        }
    };


    $scope.findColNumberPerRow = function () {
        if ($window.matchMedia("(min-width:992px)").matches) {
            return 4;
        }
        return 1;
    };

    $scope.reloadWithParams = function (params) {
        $state.params = params;
        $scope.reload();
        $state.go('.', params);
    };

    $scope.reload = function () {

        var queryParams = {
            limit: $state.params.limit,
            page: $state.params.page,
            sort: $state.params.sort,
            title: $state.params.title
        };

        if (queryParams.title) {
            SearchbarService.searchbarIsOpened = true;
            SearchbarService.searchData.searchText = queryParams.title;
        }

        MovieRepository.getAll(queryParams).then(function (data) {
            $scope.movies = data.movies;
            $scope.totalItems = data.pagination.totalCount;
            $scope.currentPage = data.pagination.page + 1;
            $scope.extendMoviesWithRating(data.movies);
            $scope.extendMoviesWithWatched(data.movies);
        });

        $scope.showMovieFullInfo = false;
    };
    $scope.reload();

    $scope.update = function (movie) {
        var destinationState = {name: 'movies'};
        $state.go('updatemovie', {movieId: movie.id, destinationState: destinationState}, {reload: true});
    };

    $scope.extendMoviesWithRating = function (movies) {
        angular.forEach(movies, function (movie) {
            MovieRepository.getRating(movie).then(function (data) {
                movie = angular.extend(movie, data);
                movie.oldAverageRating = data.averageRating;
            });
        });
    };

    $scope.extendMoviesWithWatched = function (movies) {
        angular.forEach(movies, function (movie) {
            MovieRepository.getWatched(movie).then(function (data) {
                movie = angular.extend(movie, data);
            });
        });
    };

    $scope.setWatched = function (movie) {
        MovieRepository.setWatched(movie, movie.hasWatched).then(function (data) {
            movie.hasWatched = data.hasWatched;
            movie.hasWatched ? movie.usersWatched++ : movie.usersWatched--;
        });
    };

    $scope.setRating = function (movie, value) {
        if ($scope.isMovieRateable(movie)) {
            MovieRepository.setRating(movie, value).then(function (data) {
                movie.ownRating = data.ownRating;
                movie.oldAverageRating = data.averageRating;
            });
        }
    };

    $scope.ratingLeaved = function (movie) {
        movie.averageRating = movie.oldAverageRating;
    };

    $scope.isMovieRateable = function (movie) {
        return movie.hasWatched == true;
    };

    $scope.pageChanged = function (nextPage) {
        $scope.reloadWithParams({
            page: nextPage - 1,
            sort: ''
        });
    };

}]);