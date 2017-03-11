'use strict';

var app = angular.module('myApp.model');

app.factory('Movie', ['EventHandler', function (EventHandler) {

    var currentUser = null;

    EventHandler.subscribe('currentUserChanged', function (event, user) {
        currentUser = user;
    });

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

    Movie.prototype.isCommentDeletable = function (comment) {
        if (currentUser == null) {
            return false;
        }
        return currentUser.equals(comment.user) || currentUser.isAdmin();
    };

    Movie.prototype.isRateable = function () {
        return this.ownWatched.value == true;
    };

    return Movie;
}]);

app.factory('MovieRepository', ['ErrorHandler', 'Movie', 'ApiManagerUtil', function (ErrorHandler, Movie, ApiManagerUtil) {

    function transformMovieResponse(data) {
        data.id = data._id || undefined;
        var result = new Movie(data);
        return result;
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
            return ApiManagerUtil.get('movies', params, {}, options);
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
            return ApiManagerUtil.get('movies/' + id, {}, {}, options);
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
            return ApiManagerUtil.delete('movies/' + movie.id, options);
        },
        setWatched: function (movie, hasWatched) {
            var url = (hasWatched ? 'watched' : 'unwatched');
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.set('movies/' + movie.id + '/' + url, options);
        },
        setRating: function (movie, rating) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.update('movies/' + movie.id + '/rating', {value: rating}, options);
        },
        getGenres: function () {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'genres',
                        isCollection: true
                    }
                ]
            };
            return ApiManagerUtil.get('movies/genres', {}, {}, options);
        },
        getActors: function () {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'actors',
                        isCollection: true
                    }
                ]
            };
            return ApiManagerUtil.get('movies/actors', {}, {}, options);
        },
        getTags: function () {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'tags',
                        isCollection: true
                    }
                ]
            };
            return ApiManagerUtil.get('movies/tags', {}, {}, options);
        },
        postComment: function (movie, comment) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.create('movies/' + movie.id + '/comments', {text: comment}, options);
        },
        deleteComment: function (movie, comment) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movie',
                        isCollection: false,
                        transformerFunction: transformMovieResponse
                    }
                ]
            };
            return ApiManagerUtil.delete('movies/' + movie.id + '/comments/' + comment._id, options);
        }
    };
}]);