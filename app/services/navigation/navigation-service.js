'use strict';

var app = angular.module('myApp.navigation');

app.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("landingpage");
    //$locationProvider.html5Mode(true);
}]);

app.factory('NavigationElement', function () {

    function NavigationElement(data) {
        this.name = data.name;
        this.caption = data.caption;
        if (data.anchor) {
            this.anchor = data.anchor;
        }
        this.goToState = data.goToState;
        this.clickHandler = data.clickHandler;
    }

    NavigationElement.build = function (data) {
        return new NavigationElement(data);
    };
    return NavigationElement;
});


app.factory('NavigationService', ['$state', 'NavigationElement', 'AuthenticationService', 'LoginViewManager', function ($state, NavigationElement, AuthenticationService, LoginViewManager) {

    var moviesElement = NavigationElement.build({
        name: 'movies', caption: 'Movies', goToState: 'movies', clickHandler: function () {
        }
    });

    var addMovieElement = NavigationElement.build({
        name: 'addmovie', caption: 'add Move', goToState: 'addmovie', clickHandler: function () {
        }
    });

    var loginElement = NavigationElement.build({
        name: 'login', caption: 'Login', anchor: 'page-top', clickHandler: function () {
            LoginViewManager.login().then(function () {
                $state.go('movies');
            }, function () {
                $state.go('landingpage');
            });
        }
    });

    var logoutElement = NavigationElement.build({
        name: 'logout', caption: 'Logout', anchor: 'page-top', clickHandler: function () {
            AuthenticationService.logout();
            $state.go('landingpage');
        }
    });

    var getNavigationElements = function () {
        if (AuthenticationService.isLoggedIn()) {
            return [
                moviesElement,
                addMovieElement,
                logoutElement
            ];
        } else {
            return [loginElement]
        }
    };

    return {
        navigationElements: getNavigationElements
    };

}]);

app.controller('NavigationCtrl', ['$scope', 'NavigationService', function ($scope, NavigationService) {

    $scope.navigationElements = NavigationService.navigationElements;

}]);