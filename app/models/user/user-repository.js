'use strict';

var app = angular.module('myApp.model');

app.factory ('UserRepository', ['User', 'ApiManagerUtil', function (User, ApiManagerUtil) {
    return {
        createFromResponse: function (data) {
            var id = data._id || data.id;
            return new User(
                id,
                data.username
            );
        },
        register: function (username, password) {
            var options = {
                responseBodyKey: 'user',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.create('register', {username: username, password: password}, options);
        },
        getMe: function (username, password) {
            var options = {
                responseBodyKey: 'user',
                responseSuccessInterceptor: this.createFromResponse
            };
            return ApiManagerUtil.getSingle('me', options);
        }
    };
}]);