'use strict';

var app = angular.module('myApp.model');


app.factory('Movie', function () {

    function Movie(data) {
        for (var attr in data) {
            if (data.hasOwnProperty(attr))
                this[attr] = data[attr];
        }
    }

    Movie.prototype.getPosterUrl = function () {
        if (this.poster) {
            return this.poster;
        }
        return './app/img/movie/movie-default-thumbnail.png';
    };

    return Movie;
});

app.factory('MovieRepository', ['ErrorHandler', 'Movie', 'ApiManagerUtil', function (ErrorHandler, Movie, ApiManagerUtil) {

    function transformMovieResponse(data) {
        data.id = data._id || undefined;
        return new Movie(data);
    }

    return {
        getAll: function (params) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movies',
                        isCollection: true,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.get('movies', params, options);
        },
        getById: function (id) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.get('movies/' + id, {}, options);
        },
        create: function (movie) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.create('movies', movie, options);
        },
        update: function (movie) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.update('movies/' + movie.id, movie, options);
        },
        delete: function (movie) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.delete('movies/' + movie.id, movie, options);
        },
        getWatched: function (movie) {
            var options = {
                elementTransformers: [
                    {
                        directWithoutKeyName: true,
                        isCollection: false,
                        transformerFunction: function (model) {
                            var usersWatched = model.users.length;
                            if (model.watched) {
                                usersWatched++;
                            }
                            return {
                                hasWatched: model.watched,
                                users: model.users,
                                usersWatched: usersWatched

                            }
                        }
                    }
                ]
            };
            return ApiManagerUtil.get('movies/' + movie.id + '/watched', {}, options);
        },
        setWatched: function (movie, hasWatched) {
            var url = (hasWatched ? 'watched' : 'unwatched');
            var options = {
                elementTransformers: [
                    {
                        directWithoutKeyName: true,
                        isCollection: false,
                        transformerFunction: function (model) {
                            return {
                                hasWatched: model.watched
                            }
                        }
                    }
                ]
            };
            return ApiManagerUtil.set('movies/' + movie.id + '/' + url, options);
        },
        getRating: function (movie) {
            var options = {
                elementTransformers: [
                    {
                        directWithoutKeyName: true,
                        isCollection: false,
                        transformerFunction: function (model) {
                            return {
                                ownRating: model.ownRating,
                                averageRating: model.averageRating,
                                usersRating: model.usersRating
                            };
                        }
                    }
                ]
            };
            return ApiManagerUtil.get('movies/' + movie.id + '/rating', {}, options);
        },
        setRating: function (movie, rating) {
            var options = {
                elementTransformers: [
                    {
                        directWithoutKeyName: true,
                        isCollection: false,
                        transformerFunction: function (model) {
                            return {
                                ownRating: model.ownRating,
                                averageRating: model.averageRating
                            }
                        }
                    }
                ]
            };
            return ApiManagerUtil.update('movies/' + movie.id + '/rating', {value: rating}, options);
        },
    };
}]);