var app = angular.module('myApp.searchbar', ['ui.bootstrap']);

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
    $provide.decorator('SearchbarService', ['$delegate', '$cookieStore', '$rootScope', function ($delegate, $cookieStore, $rootScope) {

        var dataKey = "SearchData";
        var settingsKey = "SearchSettings";

        $rootScope.$on('searchbarSubmitted', function () {
            $cookieStore.put(dataKey, $delegate.data);
            $cookieStore.put(settingsKey, $delegate.settings);
        });

        function initialize() {
            $delegate.data = $cookieStore.get(dataKey) || {};
            $delegate.settings = $cookieStore.get(settingsKey) || {};
        }

        initialize();

        return $delegate;
    }]);
}]);

app.controller('SearchbarCtrl', ['$scope', '$rootScope', '$state', 'SearchbarService', function ($scope, $rootScope, $state, SearchbarService) {

    $scope.SearchbarService = SearchbarService;

}]);