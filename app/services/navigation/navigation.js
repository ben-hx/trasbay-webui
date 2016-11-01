'use strict';

var app = angular.module('myApp.navigation', ['ngRoute', 'myApp.authentication', 'myApp.login']);

app.run(['$rootScope', '$location', 'AuthenticationService', function ($rootScope, $location, AuthenticationService) {

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        $('.footer').hide();
        if (!AuthenticationService.isLoggedIn()) {
            //$location.path('/landingpage').hash('').replace();
            $location.path('/landingpage').replace();
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (event) {
        //$('.footer').show();
    });

    $('.view-animate').on('$animate:close', function (data) {
        console.log("aloo");
    });

}]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    console.log("fu");
    //$routeProvider.otherwise({redirectTo: '/landingpage'});
}]);

app.factory('NavigationElement', function () {

    function NavigationElement(name, caption, anchor, clickHandler) {
        this.name = name;
        this.caption = caption;
        this.anchor = anchor;
        this.clickHandler = clickHandler;
    }

    NavigationElement.build = function (data) {
        return new NavigationElement(
            data.name,
            data.caption,
            data.anchor || '',
            data.clickHandler
        );
    };
    return NavigationElement;
});


app.factory('NavigationService', ['$location', 'NavigationElement', 'AuthenticationService', 'LoginViewManager', function ($location, NavigationElement, AuthenticationService, LoginViewManager) {

    var moviesElement = NavigationElement.build({
        name: 'movies', caption: 'Movies', anchor: 'movies', clickHandler: function () {
            $location.path('/movies').replace();
        }
    });

    var addMovieElement = NavigationElement.build({
        name: 'addmovie', caption: 'add  Movie', clickHandler: function () {
            $location.path('/addmovie').replace();
        }
    });

    var loginElement = NavigationElement.build({
        name: 'login', caption: 'Login', anchor: 'page-top', clickHandler: function () {
            LoginViewManager.login().then(function () {
                $location.path('/addmovie').replace();
            }, function () {
                $location.path('/landingpage').replace();
            });
        }
    });

    var logoutElement = NavigationElement.build({
        name: 'logout', caption: 'Logout', anchor: 'page-top', clickHandler: function () {
            AuthenticationService.logout();
            $location.path('/landingpage').replace();
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