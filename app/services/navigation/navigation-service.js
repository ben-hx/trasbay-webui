'use strict';

var app = angular.module('myApp.navigation');

app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("landingpage");
    //$locationProvider.html5Mode(true);

}]);

app.run(['$rootScope', '$state', 'AuthenticationService', 'LoginViewManager', 'SearchbarService', function ($rootScope, $state, AuthenticationService, LoginViewManager, SearchbarService) {

    function prepareSearchBar() {
        SearchbarService.showSearchbar = false;
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var landingPageStateName = 'landingpage';
        var stopEventPropagation = angular.equals(fromState, toState) && angular.equals(fromParams, toParams);
        if (!AuthenticationService.isLoggedIn() && !toState.name == landingPageStateName) {
            stopEventPropagation = true;
            LoginViewManager.login().then(function () {
                $state.transitionTo(toState.name, toParams, {reload: true});
            }, function () {
                $state.transitionTo(landingPageStateName, toParams, {reload: true});
            });
        }

        if (stopEventPropagation) {
            event.preventDefault();
        } else {
            prepareSearchBar();
        }
    });
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

    NavigationElement.prototype.changeRoute = function () {
        return (this.goToState ? true : false);
    };

    NavigationElement.build = function (data) {
        return new NavigationElement(data);
    };

    return NavigationElement;
});


app.factory('NavigationService', ['$state', 'NavigationElement', 'AuthenticationService', 'LoginViewManager', function ($state, NavigationElement, AuthenticationService, LoginViewManager) {

    var moviesElement = NavigationElement.build({
        name: 'movies', caption: 'Movies', goToState: 'movies', clickHandler: function () {
            $state.go('movies', {}, {reload: true});
        }
    });

    var addMovieElement = NavigationElement.build({
        name: 'addmovie', caption: 'add Move', goToState: 'addmovie', clickHandler: function () {
            var destinationState = {name: 'movies'};
            $state.go('addmovie', {destinationState: destinationState}, {reload: true});
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


app.controller('NavigationCtrl', ['$scope', '$state', 'NavigationService', function ($scope, $state, NavigationService) {

    $scope.navigationElements = NavigationService.navigationElements;

}]);