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
    };
}]);