'use strict';

var app = angular.module('myApp.error');

app.service('ErrorHandler', [function () {
    var UNEXPECTED_STATUS = -1;

    function ValidationError(error) {
        this.name = 'ValidationError';
        this.parentError = error;
        this.message = buildMessage(error);

        function buildMessage(error) {
            var result = '<b>' + error.message + '</b><br>';
            var errors = error.data.errors;
            for (var field in errors) {
                result = result + '<br>' + errors[field].message;
            }
            return result;
        }
    }

    function AuthenticationError(error) {
        this.name = 'AuthenticationError';
        this.parentError = error;
        this.message = error.message;
    }

    function ApiIsOfflineError(error) {
        this.name = 'ApiIsOfflineError';
        this.parentError = error;
        this.message = error.message;
    }

    function VestigalError(message) {
        this.name = 'VestigalError';
        this.message = message;
    }

    return {
        getErrorFromResponse: function (response) {
            if (typeof response.data == 'string') {
                return new VestigalError(response.data);
            }
            if (!response.data && response.status === UNEXPECTED_STATUS) {
                return new ApiIsOfflineError(response.data);
            }
            if (response.data.error.name === 'ValidationError') {
                return new ValidationError(response.data.error);
            }
            if (response.data.error.name = 'AuthenticationError') {
                return new AuthenticationError(response.data);
            }
            return new VestigalError(response.data);
        }
    };
}]);