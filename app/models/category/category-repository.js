'use strict';

var app = angular.module('myApp.model');

app.factory('CategoryRepository', ['ApiManagerUtil', function (ApiManagerUtil) {
    return {
        getAll: function () {
            var options = {
                responseBodyKey: 'categories',
                responseSuccessSingleInterceptor: function (data) {
                    return data;
                }
            };
            return ApiManagerUtil.getCollection('categories', {}, options);
        }
    };
}]);