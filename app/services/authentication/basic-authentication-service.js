'use strict';

var app = angular.module('myApp.basic-authentication', ['ngCookies', 'myApp.model']);

app.service('BasicAuthenticationService', ['$cookieStore', '$q', 'UserRepository', 'ApiManagerUtil', function ($cookieStore, $q, UserRepository, ApiManagerUtil) {
    var loggedInUser = null;
    var currentUserCookieKey = "CurrentUser";

    var changeLoggedInUser = function (user, password) {
        loggedInUser = user;
        $cookieStore.put(currentUserCookieKey, {user: user, password: password});
        changeHeader(user.email, password);
    };

    var changeHeader = function (email, password) {
        ApiManagerUtil.setDefaultHeaders({Authorization: 'Basic ' + btoa(email + ':' + password)});
    };

    var clearLoggedInUser = function () {
        loggedInUser = null;
        $cookieStore.remove(currentUserCookieKey);
        ApiManagerUtil.setDefaultHeaders({});
    };

    return {
        login: function (email, password) {
            var deferred = $q.defer();
            changeHeader(email, password);
            UserRepository.getMe().then(function (user) {
                changeLoggedInUser(user, password);
                deferred.resolve(user);
            }, function (error) {
                clearLoggedInUser();
                deferred.reject(error);
            });
            return deferred.promise;
        },
        register: function (email, password) {
            var deferred = $q.defer();
            UserRepository.register(email, password).then(function (oasch) {
                changeLoggedInUser(oasch, password);
                deferred.resolve(oasch);
            }, function (error) {
                clearLoggedInUser();
                deferred.reject(error);
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
            if (storageObject && storageObject.user) {
                changeLoggedInUser(storageObject.user, storageObject.password);
            }
        }
    };
}]);