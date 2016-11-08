'use strict';

var app = angular.module('myApp.model');

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
            return new Movie(
                undefined,
                data.Title,
                data.Year,
                data.Runtime,
                splitCommaSeperatedStringToArray(data.Genre),
                splitCommaSeperatedStringToArray(data.Director),
                splitCommaSeperatedStringToArray(data.Writer),
                splitCommaSeperatedStringToArray(data.Actors),
                data.Plot,
                splitCommaSeperatedStringToArray(data.Language),
                data.Country,
                data.Poster,
                undefined
            );
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
                    deferred.reject(ErrorHandler.getErrorFromResponse(error));
                });
            }
            return deferred.promise;
        }
    };
}])
