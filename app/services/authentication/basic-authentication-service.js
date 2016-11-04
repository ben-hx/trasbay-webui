'use strict';

var app = angular.module('myApp.basic-authentication', ['ngCookies', 'myApp.model']);

app.service('BasicAuthenticationService', ['$cookieStore', '$q', 'UserRepository', 'ApiManagerUtil', function ($cookieStore, $q, UserRepository, ApiManagerUtil) {
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
            var deferred = $q.defer();
            changeHeader(username, password);
            UserRepository.getMe().then(function (user) {
                changeLoggedInUser(UserRepository.createFromResponse(user), password);
                deferred.resolve(user);
            }, function (error) {
                clearLoggedInUser();
                deferred.resolve(error);
            });
            return deferred.promise;
        },
        register: function (username, password) {
            var deferred = $q.defer();
            UserRepository.register(username, password).then(function (user) {
                changeLoggedInUser(UserRepository.createFromResponse(user), password);
                deferred.resolve(user);
            }, function (error) {
                clearLoggedInUser();
                deferred.resolve(error);
            });
            return deferred.promise;
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