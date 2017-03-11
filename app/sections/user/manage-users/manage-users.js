var app = angular.module('myApp.user');

app.controller('ManageUsersCtrl', ['$scope', '$state', 'NgTableParams', 'UserRepository', 'AuthenticationService', function ($scope, $state, NgTableParams, UserRepository, AuthenticationService) {

    $scope.init = function () {
        $scope.currentUserId = AuthenticationService.getLoggedInUser()._id;
        $scope.refresh();
    };

    $scope.refresh = function () {
        UserRepository.getUsers().then(function (doc) {
            $scope.tableParams = new NgTableParams({count: 20, sorting: {email: "asc"}}, {
                counts: [],
                dataset: doc.users
            });
        });
    };

    $scope.$on('userActivated', function (event, user) {
        $scope.refresh();
    });

    $scope.updateUser = function (user, form) {
        form.whileLoading = true;
        UserRepository.setUserRole(user, user.role).then(function (updatedUser) {
            user = updatedUser;
        }).finally(function () {
            form.whileLoading = false;
        });
    };

    $scope.deleteUser = function (user, users, index, form) {
        form.whileLoading = true;
        UserRepository.deleteUser(user).then(function () {
            users.splice(index, 1);
        }).finally(function () {
            form.whileLoading = false;
        });
    }

}]);
