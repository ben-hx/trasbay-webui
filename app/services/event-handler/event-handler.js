'use strict';

var app = angular.module('myApp.eventHandler', []);

app.service('EventHandler', ['$rootScope', function ($rootScope) {

    return {
        emit: function (name, object) {
            $rootScope.$broadcast(name, object);
        },
        subscribe: function (name, callback) {
            $rootScope.$on(name, callback);
        }
    };
}]);