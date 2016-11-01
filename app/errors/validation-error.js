var app = angular.module('myApp.error');

app.factory('ValidationError', function () {

    function ValidationError(message, errors) {
        this.message = message;
        this.errors = errors;
    }

    ValidationError.build = function (data) {
        return new ValidationError(
            data.message,
            data.errors
        );
    };

    return ValidationError;
})
