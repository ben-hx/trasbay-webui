var app = angular.module('myApp.user');

app.controller('ManageInaktiveUsersCtrl', ['$scope', '$rootScope', '$state', 'NgTableParams', 'UserRepository', function ($scope, $rootScope, $state, NgTableParams, UserRepository) {

    $scope.init = function () {
        $scope.refresh();
    };

    $scope.refresh = function () {
        UserRepository.getInaktviveUsers().then(function (doc) {
            console.log(doc);
            $scope.tableParams = new NgTableParams({count: 20, sorting: {email: "asc"}}, {
                counts: [],
                dataset: doc.users
            });
        });
    };

    $scope.broadcastActivatedUser = function (activatedUser) {
        $rootScope.$broadcast("userActivated", activatedUser);
    };

    $scope.activate = function (user, form) {
        form.whileLoading = true;
        UserRepository.activateUser(user).then(function (activatedUser) {
            $scope.broadcastActivatedUser(activatedUser);
            $scope.refresh();
        }).finally(function () {
            form.whileLoading = false;
        });
    };

    $scope.deleteUser = function (user, users, index, form) {
        form.whileLoading = true;
        UserRepository.deleteInaktiveUser(user).then(function () {
            users.splice(index, 1);
        }).finally(function () {
            form.whileLoading = false;
        });
    }

}]);