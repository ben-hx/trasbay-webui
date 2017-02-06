'use strict';

var app = angular.module('myApp.error');

app.service('ErrorHandler', ['ApiIsOfflineError', 'ValidationError', 'NotAuthorizedError', 'VestigalError', function (ApiIsOfflineError, ValidationError, NotAuthorizedError, VestigalError) {
    var UNEXPECTED_STATUS = -1;

    return {
        getErrorFromResponse: function (response) {
            if (typeof response.data == 'string') {
                return {message: response.data};
            }
            if (!response.data && response.status === UNEXPECTED_STATUS) {
                return ApiIsOfflineError.build()
            }
            if (response.data.error.name === 'ValidationError') {
                return ValidationError.build(response.data.error);
            }
            if (response.data.error.name = 'AuthenticationError') {
                return NotAuthorizedError.build(response.data.error);
            }
            return VestigalError.build();
        }
    };
}]);