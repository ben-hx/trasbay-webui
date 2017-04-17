var app = angular.module('myApp.searchbar', ['ui.bootstrap', 'myApp.eventHandler']);

app.service('SearchbarService', function () {

    return {
        templateUrl: 'services/searchbar/searchbar-text/searchbar-text.html',
        show: false,
        data: {},
        clear: function () {
            this.data = {}
        }
    };
});

app.config(['$provide', function ($provide) {
    $provide.decorator('SearchbarService', ['$delegate', '$cookieStore', 'EventHandler', function ($delegate, $cookieStore, EventHandler) {

        var dataKey = "SearchData";
        var settingsKey = "SearchSettings";

        var load = function () {
            $delegate.data = $cookieStore.get(dataKey) || {};
            $delegate.settings = $cookieStore.get(settingsKey) || {};
        };

        var save = function () {
            $cookieStore.put(dataKey, $delegate.data);
            $cookieStore.put(settingsKey, $delegate.settings);
        };

        EventHandler.subscribe('searchbarOpened', save);
        EventHandler.subscribe('searchbarSubmitted', save);
        EventHandler.subscribe('searchbarClosed', save);

        function initialize() {
            load();
        }

        initialize();

        return $delegate;
    }]);
}]);

app.controller('SearchbarCtrl', ['$scope', '$rootScope', '$state', 'SearchbarService', function ($scope, $rootScope, $state, SearchbarService) {

    $scope.SearchbarService = SearchbarService;

}]);