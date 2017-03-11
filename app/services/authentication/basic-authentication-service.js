'use strict';

var app = angular.module('myApp.basic-authentication', ['ngCookies', 'myApp.model']);

app.service('BasicAuthenticationService', ['$cookieStore', '$q', 'EventHandler', 'UserRepository', 'ApiManagerUtil', function ($cookieStore, $q, EventHandler, UserRepository, ApiManagerUtil) {
    var loggedInUser = null;
    var currentUserCookieKey = "CurrentUser";

    EventHandler.subscribe('userUpdated', function (event, user) {
        var password = $cookieStore.get(currentUserCookieKey).password;
        changeLoggedInUser(user, password);
    });

    EventHandler.subscribe('passwordChanged', function (event, newPassword) {
        changeLoggedInUser(loggedInUser, newPassword);
    });

    var broadcastCurrentUserChanged = function () {
        EventHandler.emit('currentUserChanged', loggedInUser);
    };

    var changeHeader = function (email, password) {
        ApiManagerUtil.setDefaultHeaders({Authorization: 'Basic ' + btoa(email + ':' + password)});
    };

    var changeLoggedInUser = function (user, password) {
        loggedInUser = user;
        broadcastCurrentUserChanged();
        $cookieStore.put(currentUserCookieKey, {user: user, password: password});
        changeHeader(user.email, password);
    };

    var clearLoggedInUser = function () {
        loggedInUser = null;
        broadcastCurrentUserChanged();
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
            UserRepository.register(email, password).then(function (user) {
                deferred.resolve(user);
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
        isInAnyRole: function (roles) {
            if (!loggedInUser) {
                return false;
            }
            var result = false;
            angular.forEach(roles, function (role) {
                if (loggedInUser.role == role) {
                    result = true;
                }
            });
            return result;
        },
        logout: clearLoggedInUser,
        initialize: function () {
            var self = this;
            var storageObject = $cookieStore.get(currentUserCookieKey);
            if (storageObject && storageObject.user) {
                var dummyUser = UserRepository.createFromData(storageObject.user);
                changeLoggedInUser(dummyUser, storageObject.password);
                self.login(dummyUser.email, storageObject.password);
            }
        }
    };
}]);