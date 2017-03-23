'use strict';

var app = angular.module('myApp.model');

app.factory('User', ['EventHandler', function (EventHandler) {

    var currentUser = null;

    EventHandler.subscribe('currentUserChanged', function (event, user) {
        currentUser = user;
    });

    function User(data) {
        for (var attr in data) {
            if (data.hasOwnProperty(attr))
                this[attr] = data[attr];
        }
    }

    User.prototype.isAdmin = function () {
        return this.role == 'admin';
    };

    User.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        return other._id == this._id;
    };

    User.prototype.toString = function () {
        if (this.equals(currentUser)) {
            return "me";
        }
        return this.email;
    };

    return User;
}]);

app.factory('UserRepository', ['User', 'EventHandler', 'ApiManagerUtil', function (User, EventHandler, ApiManagerUtil) {

    function createFromResponse(data) {
        data.id = data._id || undefined;
        return new User(data);
    }

    return {
        createFromData: function (data) {
            return createFromResponse(data);
        },
        register: function (data) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.create('register', data, options);
        },
        update: function (user) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'user',
                        isCollection: false,
                        transformerFunction: createFromResponse
                    }
                ]
            };
            return ApiManagerUtil.update('me', user, options);
        },
        verifyPassword: function (password) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'isMatch',
                        isCollection: false
                    }
                ]
            };
            return ApiManagerUtil.update('verify_password', {password: password}, options);
        },
        changePassword: function (oldPassword, newPassword) {
            var options = {
                elementTransformers: [
                    {
                        keyName: '',
                        isCollection: false
                    }
                ]
            };
            return ApiManagerUtil.update('change_password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, options);
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
            return ApiManagerUtil.get('me', {}, {}, options);
        },
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
            return ApiManagerUtil.get('users', {}, {}, options);
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
            return ApiManagerUtil.delete('users/' + user._id, options);
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
            return ApiManagerUtil.delete('inaktive_users/' + user._id, options);
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
            return ApiManagerUtil.get('inaktive_users', {}, {}, options);
        }
    };
}]);