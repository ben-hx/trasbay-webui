'use strict';

var app = angular.module('myApp.model');

app.config(['$provide', function ($provide) {
    $provide.decorator('ApiManagerUtil', [
        '$delegate',
        '$q',
        '$state',
        'ErrorHandler',
        function ($delegate, $q, $state, ErrorHandler) {
            var request = $delegate.request;

            $delegate.request = function () {
                var originaRequest = request.apply($delegate, arguments);
                var deferred = $q.defer();
                originaRequest.then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    error = ErrorHandler.getErrorFromResponse(error);
                    var badError = (error.name && error.name == 'ApiIsOfflineError') ||
                        (error.name && error.name == 'VestigalError');
                    if (badError) {
                        $state.go('error', {error: error}, {reload: true});
                    }
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            return $delegate;
        }]);
}]);