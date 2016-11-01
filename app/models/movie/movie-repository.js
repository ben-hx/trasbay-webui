'use strict';

var app = angular.module('myApp.model');

app.factory ('MovieRepository', ['Movie' ,'ApiManagerUtil', function (Movie, ApiManagerUtil) {
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
        create: function (data) {
            return ApiManagerUtil.create('notes', data, this.createFromResponse);
        },
        update: function (note) {
            return ApiManagerUtil.update('movies', movie, this.createFromResponse);
        },
        delete: function (note) {
            return ApiManagerUtil.delete('movies', movie, this.createFromResponse);
        }
    };
}]);