var app = angular.module('myApp.model');

app.factory('User', function () {

    function User(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    return User;
});
