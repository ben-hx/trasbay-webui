var app = angular.module('myApp.user');

app.config(function (errorHandlerProvider, $provide) {
    errorHandlerProvider.decorate($provide, ['UserRepository']);
});

app.config(['$provide', function ($provide) {
    $provide.decorator('UserRepository', ['$delegate', '$q', 'NotificationService', 'ConfirmationViewManager', function ($delegate, $q, NotificationService, ConfirmationViewManager) {

        var toString = function (object) {
            return object.email;
        };

        var register = $delegate.register;
        $delegate.register = function (email, password) {
            return register(email, password).then(function (result) {
                NotificationService.pushSuccess({message: 'Thx for registration!'});
                return result;
            });
        };

        var update = $delegate.update;
        $delegate.update = function (user) {
            return update(user).then(function (result) {
                NotificationService.pushSuccess({message: 'User updated!'});
                return result;
            });
        };

        var changePassword = $delegate.changePassword;
        $delegate.changePassword = function (oldPassword, newPassword) {
            return changePassword(oldPassword, newPassword).then(function (result) {
                NotificationService.pushSuccess({message: 'Password changed!'});
                return result;
            });
        };

        var setUserRole = $delegate.setUserRole;
        $delegate.setUserRole = function (user, role) {
            return setUserRole(user, role).then(function (result) {
                NotificationService.pushSuccess({message: 'User role updated!'});
                return result;
            });
        };

        var activateUser = $delegate.activateUser;
        $delegate.activateUser = function (user) {
            return activateUser(user).then(function (result) {
                NotificationService.pushSuccess({message: 'User  "' + toString(result) + '" activated!'});
                return result;
            });
        };

        var deleteUser = $delegate.deleteUser;
        $delegate.deleteUser = function (user) {
            return ConfirmationViewManager.show({bodyText: 'Are you sure you want to delete the user "' + toString(user) + '"?'}).then(function () {
                return deleteUser(user).then(function (result) {
                    NotificationService.pushSuccess({message: 'User  "' + toString(result) + '" deleted!'});
                    return result;
                });
            });
        };

        var deleteInaktiveUser = $delegate.deleteInaktiveUser;
        $delegate.deleteInaktiveUser = function (user) {
            return ConfirmationViewManager.show({bodyText: 'Are you sure you want to delete the inaktive-user "' + toString(user) + '"?'}).then(function () {
                return deleteInaktiveUser(user).then(function (result) {
                    NotificationService.pushSuccess({message: 'Inaktive-user  "' + toString(result) + '" deleted!'});
                    return result;
                });
            });
        };

        return $delegate;
    }]);
}]);