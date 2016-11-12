'use strict';

var app = angular.module('myApp.model');

app.factory('User', function () {

    function User(data) {
        for (var attr in data) {
            if (data.hasOwnProperty(attr))
                this[attr] = data[attr];
        }
    }

    return User;
});

app.factory('UserRepository', ['User', 'ApiManagerUtil', function (User, ApiManagerUtil) {

    function createFromResponse(data) {
        data.id = data._id || undefined;
        return new User(data);
    }

    return {
        register: function (email, password) {
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
        }
    };
}]);