'use strict';

var app = angular.module('myApp.model');

app.factory('UserRepository', ['User', 'ApiManagerUtil', function (User, ApiManagerUtil) {
    function createFromResponse(data) {
        var id = data._id || data.id;
        return new User(
            id,
            data.username,
            data.email
        );
    };
    return {
        register: function (email, password) {
            /*
            var options = {
                responseBodyKey: 'user',
                responseSuccessInterceptor: createFromResponse
            };
            return ApiManagerUtil.create('register', {email: email, password: password}, options);
            */
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.create('register', {email: email, password: password}, options);
        },
        getMe: function (username, password) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.get('me', {}, options);
            /*
            var options = {
                responseBodyKey: 'user',
                responseSuccessInterceptor: createFromResponse
            };
            return ApiManagerUtil.getSingle('me', options);
            */
        }
    };
}]);