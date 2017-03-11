'use strict';

var app = angular.module('myApp.uiUtil', ['myApp.eventHandler', 'myApp.notification']);

app.service('UiUtil', ['EventHandler', 'NotificationService', function (EventHandler, NotificationService) {

    var currentUser = null;

    EventHandler.subscribe('currentUserChanged', function (event, user) {
        currentUser = user;
    });

    return {
        initialize: function () {
            EventHandler.subscribe('onError', function (event, error) {
                NotificationService.pushError(error);
            });
        },
        userToString: function (user) {
            if (currentUser.equals(user)) {
                return "me";
            }
            return this.email;
        }
    };
}]);