var app = angular.module('myApp.searchbar');

app.controller('SearchbarTextCtrl', ['$scope', '$rootScope', '$state', 'SearchbarService', function ($scope, $rootScope, $state, SearchbarService) {

    $scope.init = function () {
        $scope.SearchbarService = SearchbarService;
    };

    $scope.searchOnOpen = function () {
        SearchbarService.settings.isOpen = true;
        $rootScope.$broadcast('searchbarOpened', SearchbarService.data);
    };

    $scope.searchOnChange = function () {
        $rootScope.$broadcast('searchbarChanged', SearchbarService.data);
    };

    $scope.searchOnSubmit = function () {
        $rootScope.$broadcast('searchbarSubmitted', SearchbarService.data);
    };

    $scope.searchOnClosed = function () {
        SearchbarService.settings.isOpen = false;
        $rootScope.$broadcast('searchbarClosed', SearchbarService.data);
    };

}]);