var app = angular.module('myApp.error');

app.factory('VestigalError', function () {

    function VestigalError(message) {
        this.message = message;
    }

    VestigalError.build = function () {
        return new VestigalError(
            "Unexpected Error!"
        );
    };

    return VestigalError;
});
