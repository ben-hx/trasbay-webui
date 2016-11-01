var app = angular.module('myApp.error');

app.factory('NotAuthorizedError', function () {

    function NotAuthorizedError(message, errors) {
        this.message = message;
    }

    NotAuthorizedError.build = function (data) {
        return new NotAuthorizedError(
            data.message
        );
    };

    return NotAuthorizedError;
})
