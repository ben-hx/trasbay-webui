var app = angular.module('myApp.model');

app.factory('User', function () {

    function User(id, username) {
        this.id = id;
        this.username = username;
    }

    return User;
})
