'use strict';

var app = angular.module('myApp.notification', ['ui-notification']);

app.config(function (NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 30,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'center',
        positionY: 'top'
    });
});

app.factory('NotificationService', ['Notification', function (Notification) {

    return {
        pushSuccess: function (notification) {
            Notification.success(notification);
        },
        pushError: function (notification) {
            Notification.error(notification);
        }
    };

}]);