'use strict';

var app = angular.module('myApp.model');

app.factory('MovieShort', function () {

    function MovieShort(title, year, poster, imdbId) {
        this.title = title;
        this.year = year;
        this.poster = poster;
        this.imdbId = imdbId;
    }

    return MovieShort;
});

app.factory('MovieDatabaseRepository', ['$q', '$http', 'ErrorHandler', 'Movie', 'MovieShort', function ($q, $http, ErrorHandler, Movie, MovieShort) {

    var splitCommaSeperatedStringToArray = function (str) {
        return str.split(",");
    };

    return {
        createFromShortMovieResponse: function (data) {
            return new MovieShort(
                data.Title,
                data.Year,
                data.Poster,
                data.imdbID
            );
        },
        createFromResponse: function (data) {
            var movieData = {
                _id: undefined,
                title: data.Title,
                year: data.Year,
                runtime: data.Runtime,
                genres: splitCommaSeperatedStringToArray(data.Genre),
                directors: splitCommaSeperatedStringToArray(data.Director),
                writers: splitCommaSeperatedStringToArray(data.Writer),
                actors: splitCommaSeperatedStringToArray(data.Actors),
                plot: data.Plot,
                languages: splitCommaSeperatedStringToArray(data.Language),
                country: data.Country,
                poster: data.Poster,
                userCreatedId: undefined
            };
            return new Movie(movieData);
        },
        getByImdbId: function (imdbId) {
            var deferred = $q.defer();
            var self = this;
            $http.get('http://www.omdbapi.com/', {
                params: {
                    i: imdbId,
                    r: 'json',
                    type: 'movie',
                    plot: 'full'
                }
            }).then(function (response) {
                deferred.resolve(self.createFromResponse(response.data));
            }, function (error) {
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        getShortMoviesByText: function (searchText) {
            var deferred = $q.defer();
            var self = this;
            if (searchText.length < 2) {
                deferred.resolve([]);
            } else {
                $http.get('http://www.omdbapi.com/', {
                    params: {
                        s: searchText,
                        r: 'json',
                        type: 'movie'
                    }
                }).then(function (response) {
                    if (!response.data.Search) {
                        deferred.resolve([]);
                    } else {
                        $q.all(response.data.Search.map(function (item) {
                            return self.createFromShortMovieResponse(item);
                        })).then(function (result) {
                            deferred.resolve(result);
                        });
                    }
                }, function (error) {
                    deferred.resolve([]);
                    deferred.reject(ErrorHandler.getErrorFromResponse(error));
                });
            }
            return deferred.promise;
        }
    };
}]);
