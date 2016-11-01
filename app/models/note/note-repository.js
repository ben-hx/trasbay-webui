'use strict';

var app = angular.module('myApp.model');

app.factory ('NoteRepository', ['Note' ,'ApiManagerUtil', function (Note, ApiManagerUtil) {
    return {
        createFromResponse: function (data) {
            var id = data._id || data.id;
            return new Note(
                id,
                data.text,
                data.category,
                data.urls,
                data.userId
            );
        },
        getAll: function () {
            return ApiManagerUtil.getCollection('notes', {}, this.createFromResponse);
        },
        getById: function (id) {
            return ApiManagerUtil.getSingleById('notes', id, this.createFromResponse);
        },
        create: function (text, category, urls) {
            return ApiManagerUtil.create('movies', {text: text, category: category, urls: urls}, this.createFromResponse);
        },
        update: function (note) {
            return ApiManagerUtil.update('notes', note, this.createFromResponse);
        }, 
        delete: function (note) {
            return ApiManagerUtil.delete('notes', note, this.createFromResponse);
        }
    };
}]);