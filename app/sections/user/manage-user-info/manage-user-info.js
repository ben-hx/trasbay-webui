var app = angular.module('myApp.user');

app.controller('ManageUserInfoCtrl', ['$scope', '$rootScope', 'UserRepository', 'AuthenticationService', function ($scope, $rootScope, UserRepository, AuthenticationService) {

    $scope.init = function () {
        $scope.refresh();
    };

    $scope.refresh = function () {
        $scope.user = AuthenticationService.getLoggedInUser();
    };

    $scope.broadcastUserUpdated = function (updatedUser) {
        $rootScope.$broadcast("userUpdated", updatedUser);
    };

    $scope.broadcastPasswordChanged = function (password) {
        $rootScope.$broadcast("passwordChanged", password);
    };

    $scope.save = function (user) {
        UserRepository.update(user).then(function (updatedUser) {
            $scope.user = updatedUser;
            $scope.broadcastUserUpdated(updatedUser);
        });
    };

    $scope.oldPasswordOnChange = function (password) {
        UserRepository.verifyPassword(password).then(function (response) {
            $scope.password.oldPasswordIsMatch = response.isMatch;
        });
    };

    $scope.changePassword = function (oldPassword, newPassword) {
        UserRepository.changePassword(oldPassword, newPassword).then(function (response) {
            $scope.broadcastPasswordChanged(newPassword);
            $scope.passwordWhileEditing = false;
        });
    };

}]);
