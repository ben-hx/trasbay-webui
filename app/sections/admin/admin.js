'use strict';

var app = angular.module('myApp.admin', ['ui.bootstrap', 'ngTable']);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        views: {
            "main": {
                templateUrl: 'sections/admin/admin.html',
            },
            "users@admin": {
                templateUrl: 'sections/admin/users.html',
                controller: 'UsersCtrl'
            },
            "inaktiveUsers@admin": {
                templateUrl: 'sections/admin/inaktive-users.html',
                controller: 'InaktiveUsersCtrl'
            }
        },
    });
}]);

app.controller('UsersCtrl', ['$scope', '$state', 'NgTableParams', 'AdminRepository', function ($scope, $state, NgTableParams, AdminRepository) {

    $scope.refresh = function () {
        AdminRepository.getUsers().then(function (doc) {
            $scope.tableParams = new NgTableParams({count: 20, sorting: {email: "asc"}}, {
                counts: [],
                dataset: doc.users
            });
        });
    };

    $scope.refresh();

    $scope.$on('userActivated', function (event, user) {
        $scope.refresh();
    });

    $scope.updateUser = function (user, form) {
        form.hasError = false;
        form.whileLoading = true;
        AdminRepository.setUserRole(user, user.role).then(function (updatedUser) {
            user = updatedUser;
            form.whileEditing = false;
        }).catch(function (error) {
            form.hasError = true;
            form.error = error.message;
        }).finally(function () {
            form.whileLoading = false;
        });
    };

    $scope.deleteUser = function (user, users, index, form) {
        form.hasError = false;
        form.whileLoading = true;
        AdminRepository.deleteUser(user).then(function () {
            users.splice(index, 1);
            form.whileEditing = false;
        }).catch(function (error) {
            form.hasError = true;
            form.error = error.message;
        }).finally(function () {
            form.whileLoading = false;
        });
    }

}]);

app.controller('InaktiveUsersCtrl', ['$scope', '$rootScope', '$state', 'NgTableParams', 'AdminRepository', function ($scope, $rootScope, $state, NgTableParams, AdminRepository) {

    $scope.refresh = function () {
        AdminRepository.getInaktviveUsers().then(function (doc) {
            $scope.tableParams = new NgTableParams({count: 20, sorting: {email: "asc"}}, {
                counts: [],
                dataset: doc.users
            });
        });
    };

    $scope.refresh();

    $scope.broadcastActivatedUser = function (activatedUser) {
        $rootScope.$broadcast("userActivated", activatedUser);
    };

    $scope.activate = function (user, form) {
        form.hasError = false;
        form.whileLoading = true;
        AdminRepository.activateUser(user).then(function (activatedUser) {
            $scope.broadcastActivatedUser(activatedUser);
            $scope.refresh();
            form.whileEditing = false;
        }).catch(function (error) {
            form.hasError = true;
            console.log(error);
            form.error = error.message;
        }).finally(function () {
            form.whileLoading = false;
        });
    }

    $scope.deleteUser = function (user, users, index, form) {
        form.hasError = false;
        form.whileLoading = true;
        AdminRepository.deleteInaktiveUser(user).then(function () {
            users.splice(index, 1);
            form.whileEditing = false;
        }).catch(function (error) {
            form.hasError = true;
            form.error = error.message;
        }).finally(function () {
            form.whileLoading = false;
        });
    }

}]);