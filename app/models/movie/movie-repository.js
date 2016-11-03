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
            return ApiManagerUtil.getCollection('movies', {}, this.createFromResponse);
        },
        getById: function (id) {
            return ApiManagerUtil.getSingleById('movies', id, this.createFromResponse);
        },
        create: function (movie) {
            return ApiManagerUtil.create('movies', movie, this.createFromResponse);
        },
        update: function (movie) {
            return ApiManagerUtil.update('movies', movie, this.createFromResponse);
        },
        delete: function (movie) {
            return ApiManagerUtil.delete('movies', movie, this.createFromResponse);
        },
        getWatched: function (movie) {
            return ApiManagerUtil.getSingle('movies/'+movie.id+'/watched', function (data) {
                var usersWatched = data.users.length;
                if (data.watched) {
                    usersWatched++;
                }
                return {
                    hasWatched: data.watched,
                    users: data.users,
                    usersWatched: usersWatched
                };
            });
        },
        setWatched: function (movie, hasWatched) {
            var url = (hasWatched ? 'watched' : 'unwatched');
            return ApiManagerUtil.set('movies/'+movie.id+'/'+url, function (data) {
                return {
                    hasWatched: data.watched
                }
            });
        },
    };
}]);