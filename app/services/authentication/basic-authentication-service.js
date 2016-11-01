'use strict';

var app = angular.module('myApp.basic-authentication', ['ngCookies', 'myApp.model']);

app.service('BasicAuthenticationService', ['$cookieStore', 'UserRepository', 'ApiManagerUtil', function ($cookieStore, UserRepository, ApiManagerUtil) {
    var loggedInUser = null;
    var currentUserCookieKey = "CurrentUser";

    var changeLoggedInUser = function (user, password) {
        loggedInUser = user;
        $cookieStore.put(currentUserCookieKey, {user: user, password: password});
        changeHeader(user.username, password);
    };

    var changeHeader = function (username, password) {
        ApiManagerUtil.setDefaultHeaders({Authorization: 'Basic ' + btoa(username + ':' + password)});
    };

    var clearLoggedInUser = function () {
        loggedInUser = null;
        $cookieStore.remove(currentUserCookieKey);
        ApiManagerUtil.setDefaultHeaders({});
    };

    return {
        login: function (username, password) {
            changeHeader(username, password);
            return ApiManagerUtil.getSingle('me', function (response) {
                changeLoggedInUser(UserRepository.createFromResponse(response.user), password);
            }, function (error) {
                clearLoggedInUser();
            });
        },
        register: function (username, password) {
            return ApiManagerUtil.create('register', {username: username, password: password}, function (response) {
                changeLoggedInUser(UserRepository.createFromResponse(response.user), password);
            }, function (error) {
                clearLoggedInUser();
            });
        },
        getLoggedInUser: function () {
            return loggedInUser;
        },
        isLoggedIn: function () {
            return loggedInUser != null;
        },
        logout: clearLoggedInUser,
        initialize: function () {
            var storageObject = $cookieStore.get(currentUserCookieKey);
            if (storageObject) {
                changeLoggedInUser(storageObject.user, storageObject.password);
            }
        }
    };
}]);