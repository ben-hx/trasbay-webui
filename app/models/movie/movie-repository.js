'use strict';

var app = angular.module('myApp.model');

app.factory('MovieRepository', ['ErrorHandler', 'Movie', 'ApiManagerUtil', function (ErrorHandler, Movie, ApiManagerUtil) {
    return {
        createFromResponse: function (data) {
            var id = data._id || data.id;
            return new Movie(
                id,
                data.title,
                data.year,
                data.runtime,
                data.genres,
                data.directors,
                data.writers,
                data.actors,
                data.plot,
                data.languages,
                data.country,
                data.poster,
                data.userCreatedId
            );
        },
        getAll: function () {
            var options = {
                responseBodyKey: 'movies',
                responseSuccessSingleInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.getCollection('movies', {}, options);
        },
        getById: function (id) {
            var options = {
                responseBodyKey: 'movie',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.getSingleById('movies', id, options);
        },
        create: function (movie) {
            var options = {
                responseBodyKey: 'movie',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.create('movies', movie, options);
        },
        update: function (movie) {
            var options = {
                responseBodyKey: 'movie',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.update('movies/' + movie.id, movie, options);
        },
        delete: function (movie) {
            var options = {
                responseBodyKey: 'movie',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.delete('movies/' + movie.id, movie, options);
        },
        getWatched: function (movie) {
            var options = {
                responseSuccessInterceptor: function (data) {
                    var usersWatched = data.users.length;
                    if (data.watched) {
                        usersWatched++;
                    }
                    return {
                        hasWatched: data.watched,
                        users: data.users,
                        usersWatched: usersWatched
                    };
                }
            };
            return ApiManagerUtil.getSingle('movies/' + movie.id + '/watched', options);
        },
        setWatched: function (movie, hasWatched) {
            var url = (hasWatched ? 'watched' : 'unwatched');
            var options = {
                responseSuccessInterceptor: function (data) {
                    return {
                        hasWatched: data.watched
                    }
                }
            };
            return ApiManagerUtil.set('movies/' + movie.id + '/' + url, options);
        },
        getRating: function (movie) {
            var options = {
                responseSuccessInterceptor: function (data) {
                    return {
                        ownRating: data.ownRating,
                        averageRating: data.averageRating,
                        usersRating: data.usersRating
                    };
                }
            };
            return ApiManagerUtil.getSingle('movies/' + movie.id + '/rating', options);
        },
        setRating: function (movie, rating) {
            var options = {
                responseSuccessInterceptor: function (data) {
                    return {
                        ownRating: data.ownRating,
                        averageRating: data.averageRating
                    }
                }
            };
            return ApiManagerUtil.update('movies/' + movie.id + '/rating', {value: rating}, options);
        },
    };
}]);