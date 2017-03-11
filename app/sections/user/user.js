'use strict';

var app = angular.module('myApp.user', ['myApp.confirmation', 'myApp.notification', 'ui.bootstrap', 'ngTable']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('user', {
        url: '/user',
        views: {
            "main": {
                templateUrl: 'sections/user/user.html',
            },
            "manageUserInfo@user": {
                templateUrl: 'sections/user/manage-user-info/manage-user-info.html',
                controller: 'ManageUserInfoCtrl'
            },
        },
    });
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            "main": {
                templateUrl: 'sections/user/admin.html',
            },
            "manageUserInfo@admin": {
                templateUrl: 'sections/user/manage-user-info/manage-user-info.html',
                controller: 'ManageUserInfoCtrl'
            },
            "manageUsers@admin": {
                templateUrl: 'sections/user/manage-users/manage-users.html',
                controller: 'ManageUsersCtrl'
            },
            "manageInaktiveUsers@admin": {
                templateUrl: 'sections/user/manage-inaktive-users/manage-inaktive-users.html',
                controller: 'ManageInaktiveUsersCtrl'
            }
        },
        resolve: {
            app: ['$q', 'AuthenticationService', function ($q, AuthenticationService) {
                return AuthenticationService.isInAnyRole(['admin']) ? $q.resolve() : $q.reject();
            }]
        }
    });
}]);
