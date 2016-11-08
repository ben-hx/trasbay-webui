'use strict';

var app = angular.module('myApp.navigation');

app.service("NavigationHistory", function ($state, $rootScope, $window) {

    var history = [];

    angular.extend(this, {
        push: function (state, params) {
            history.push({state: state, params: params});
        },
        all: function () {
            return history;
        },
        go: function (step) {
            // TODO:
            // (1) Determine # of states in stack with URLs, attempt to
            //    shell out to $window.history when possible
            // (2) Attempt to figure out some algorthim for reversing that,
            //     so you can also go forward

            var prev = this.previous(step || -1);
            return $state.go(prev.state, prev.params);
        },
        previous: function (step) {
            return history[history.length - Math.abs(step || 1)];
        },
        back: function () {
            return this.go(-1);
        }
    });

});

app.run(['$rootScope', '$state', 'AuthenticationService', 'NavigationHistory', function ($rootScope, $state, AuthenticationService, NavigationHistory) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (!fromState.abstract) {
            NavigationHistory.push(fromState, fromParams);
        }
    });

    NavigationHistory.push($state.current, $state.params);

}]);