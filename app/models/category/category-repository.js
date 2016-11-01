'use strict';

var app = angular.module('myApp.model');

app.factory ('CategoryRepository', ['ApiManagerUtil', function (ApiManagerUtil) {
    return {
        createFromResponse: function (data) {
            return data;
        },
        getAll: function () {
            return ApiManagerUtil.getCollection('categories', {}, this.createFromResponse);
        }
    };
}]);