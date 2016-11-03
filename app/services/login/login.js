'use strict';

var app = angular.module('myApp.login', ['myApp.authentication']);

app.factory('LoginViewManager', ['$q', '$location', '$uibModal', function($q, $location, $uibModal) {
    var deferredResult = null;

    var handleSuccessfulLogin = function () {
        deferredResult.resolve();
    };

    var handleUnsuccessfulLogin = function () {
        deferredResult.reject();
    };
    
    var handleRegister = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'services/login/register.html',
            controller: 'RegisterCtrl',
            keyboard: false
        });
        modalInstance.result.then(function () {
            handleSuccessfulLogin();
        }, function (response) {
            handleUnsuccessfulLogin();
        });
    };

    var handleLogin = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'services/login/login.html',
            controller: 'LoginCtrl',
            keyboard: false
        });
        modalInstance.result.then(function () {
            handleSuccessfulLogin();
        }, function (response) {
            if (response === 'register') {
                handleRegister();
            } else {
                handleUnsuccessfulLogin();
            }
        });
    };

    return {
        login: function () {
            deferredResult = $q.defer();
            handleLogin();
            return deferredResult.promise;
        },
        register: function () {
            deferredResult = $q.defer();
            handleRegister();
            return deferredResult.promise;
        }
    };

}]);

app.controller('LoginCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'AuthenticationService', function ($scope, $uibModalInstance, $uibModal, AuthenticationService) {

    $scope.dataLoading = false;
    $scope.error = {show: false, message: ""};

    $scope.login = function (formData) {
        $scope.dataLoading = true;
        AuthenticationService.login(formData.username, formData.password).then(function (user) {
            $uibModalInstance.close(user);
        }, function (error) {
            $scope.error.show = true;
            $scope.error.message = error.message;
        }).finally(function () {
            $scope.dataLoading = false;
        });
    };

    $scope.register = function () {
        $uibModalInstance.dismiss('register');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

app.controller('RegisterCtrl', ['$scope', '$uibModalInstance', 'AuthenticationService', function ($scope, $uibModalInstance, AuthenticationService) {

    $scope.dataLoading = false;
    $scope.error = {show: false, message: ""};

    $scope.login = function (formData) {
        $scope.dataLoading = true;
        AuthenticationService.register(formData.username, formData.password).then(function (user) {
            $uibModalInstance.close(user);
        }, function (error) {
            $scope.error.show = true;
            $scope.error.message = error.message;
        }).finally(function () {
            $scope.dataLoading = false;
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);