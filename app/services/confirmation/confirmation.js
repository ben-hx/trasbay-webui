'use strict';

var app = angular.module('myApp.confirmation', []);

app.factory('ConfirmationViewManager', ['$uibModal', function ($uibModal) {

    var defaultOptions = {
        showHeader: false,
        titleCaption: "",
        bodyText: "",
        okCaption: "Ok",
        cancelCaption: "Cancel"
    };

    return {
        show: function (options) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'services/confirmation/confirmation.html',
                controller: 'ConfirmationCtrl',
                keyboard: false,
                resolve: {
                    options: function () {
                        return angular.extend({}, defaultOptions, options);
                    }
                }
            });
            return modalInstance.result;
        }
    };

}]);

app.controller('ConfirmationCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'options', function ($scope, $uibModalInstance, $uibModal, options) {

    $scope.options = options;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

}]);