'use strict';

var app = angular.module('myApp.model');

app.factory ('UserRepository', ['User', function (User) {
    return {
        createFromResponse: function (data) {
            var id = data._id || data.id;
            return new User(
                id,
                data.username
            );
        }
    };
}]);