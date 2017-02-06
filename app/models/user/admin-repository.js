'use strict';

var app = angular.module('myApp.model');

app.factory('AdminRepository', ['User', 'UserRepository', 'ApiManagerUtil', function (User, UserRepository, ApiManagerUtil) {

    function createFromResponse(data) {
        data.id = data._id || undefined;
        return new User(data);
    }

    return angular.extend(UserRepository, {
        getUsers: function () {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'users',
                        isCollection: true,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.get('users', {}, options);
        },
        setUserRole: function (user, role) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.create('users/' + user._id + '/role/' + role, {}, options);
        },
        activateUser: function (user) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.create('users/' + user._id + '/activate', {}, options);
        },
        deleteUser: function (user) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.delete('users/' + user._id, {}, options);
        },
        deleteInaktiveUser: function (user) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.delete('inaktive_users/' + user._id, {}, options);
        },
        getInaktviveUsers: function () {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'users',
                        isCollection: true,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.get('inaktive_users', {}, options);
        }
    });

}]);