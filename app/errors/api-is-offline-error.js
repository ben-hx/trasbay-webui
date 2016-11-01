var app = angular.module('myApp.error');

app.factory('ApiIsOfflineError', function () {

    function ApiIsOfflineError(message, errors) {
        this.message = message;
    }

    ApiIsOfflineError.build = function (data) {
        return new ApiIsOfflineError(
            'Sorry the Api is Offline! We are working on this...'
        );
    };

    return ApiIsOfflineError;
})
