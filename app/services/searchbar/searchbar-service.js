var app = angular.module('myApp.searchbar', []);

app.service('SearchbarService', function () {

    return {
        showSearchbar: false,
        searchbarIsOpened: false,
        searchData: {},
        clearSearch: function () {
            this.searchData = {}
        }
    };
});

app.controller('SearchbarCtrl', ['$scope', '$rootScope', '$state', 'SearchbarService', function ($scope, $rootScope, $state, SearchbarService) {

    $scope.SearchbarService = SearchbarService;

    $scope.searchOnChange = function () {
        $rootScope.$broadcast('searchbarChanged', SearchbarService.searchData);
    };

    $scope.searchOnSubmit = function () {
        $rootScope.$broadcast('searchbarSubmitted', SearchbarService.searchData);
    };

    $scope.searchOnCleaned = function () {
        if (SearchbarService.searchData.searchText != '') {
            $scope.searchOnChange();
        }
        SearchbarService.searchData.searchText = "";
        $rootScope.$broadcast('searchbarCleared', SearchbarService.searchData);
    };


}]);