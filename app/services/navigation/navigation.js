'use strict';

var app = angular.module('myApp.navigation', []);

app.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/home");
}]);

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home'
    });
}]);

app.run(['$rootScope', '$state', 'AuthenticationService', 'LoginViewManager', 'SearchbarService', 'NavigationService', function ($rootScope, $state, AuthenticationService, LoginViewManager, SearchbarService, NavigationService) {

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        NavigationService.refreshElements();
    });

    function prepareSearchBar() {
        SearchbarService.showSearchbar = false;
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!AuthenticationService.isLoggedIn() && toState.name != 'landing') {
            event.preventDefault();
            $state.go('landing');
        }

        if (toState.name == 'home') {
            if (AuthenticationService.isLoggedIn()) {
                event.preventDefault();
                $state.go('movies');

            } else {
                event.preventDefault();
                $state.go('landing');
            }
        }

        var stopEventPropagation = angular.equals(fromState, toState) && angular.equals(fromParams, toParams);

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

app.factory('NavigationElements', ['$state', 'NavigationElement', 'AuthenticationService', 'LoginViewManager', function ($state, NavigationElement, AuthenticationService, LoginViewManager) {

    return {
        adminElement: NavigationElement.build({
            name: 'admin', caption: 'Admin', goToState: 'admin', clickHandler: function () {
                $state.go('admin');
            }
        }),

        moviesElement: NavigationElement.build({
            name: 'movies', caption: 'Movies', goToState: 'movies', clickHandler: function () {
                $state.go('movies', {}, {reload: true});
            }
        }),

        addMovieElement: NavigationElement.build({
            name: 'addmovie', caption: 'add Move', goToState: 'addmovie', clickHandler: function () {
                var destinationState = {name: 'movies'};
                $state.go('addmovie', {destinationState: destinationState}, {reload: true});
            }
        }),

        loginElement: NavigationElement.build({
            name: 'login', caption: 'Login', anchor: 'page-top', clickHandler: function () {
                LoginViewManager.login().then(function () {
                    $state.go('home');
                });
            }
        }),

        logoutElement: NavigationElement.build({
            name: 'logout', caption: 'Logout', anchor: 'page-top', clickHandler: function () {
                AuthenticationService.logout();
                $state.go('home');
            }
        })
    }

}]);

app.factory('NavigationService', ['NavigationElements', 'AuthenticationService', function (NavigationElements, AuthenticationService) {

    function getAdminElements() {
        return [
            NavigationElements.moviesElement,
            NavigationElements.addMovieElement,
            NavigationElements.adminElement,
            NavigationElements.logoutElement
        ];
    }

    function getModeratorElements() {
        return [
            NavigationElements.moviesElement,
            NavigationElements.addMovieElement,
            NavigationElements.logoutElement
        ];
    }

    function getLooserElements() {
        return [
            NavigationElements.moviesElement,
            NavigationElements.logoutElement
        ];
    }

    function getElementsForRole(role) {
        switch (role) {
            case 'admin':
                return getAdminElements();
            case 'moderator':
                return getModeratorElements();
            default:
                return getLooserElements();
        }
    }

    return {
        navigationElements: [],
        refreshElements: function () {
            var self = this;
            if (AuthenticationService.isLoggedIn()) {
                self.navigationElements = getElementsForRole(AuthenticationService.getLoggedInUser().role);
            } else {
                self.navigationElements = [NavigationElements.loginElement];
            }
        }
    };

}]);

app.controller('NavigationCtrl', ['$scope', '$window', 'NavigationService', function ($scope, $window, NavigationService) {

    $scope.NavigationService = NavigationService;
    $scope.didScroll = false;
    $scope.showShrink = false;
    $scope.changeHeaderOnPixels = 300;

    $window.addEventListener('scroll', function (e) {
        if (!$scope.didScroll) {
            $scope.didScroll = true;
            setTimeout($scope.scrollPage, 250);
        }
    });

    $scope.scrollPage = function () {
        $scope.showShrink = $scope.scrollY() >= $scope.changeHeaderOnPixels;
        $scope.didScroll = false;
    };

    $scope.scrollY = function () {
        return $window.pageYOffset || document.documentElement.scrollTop;
    };

}]);