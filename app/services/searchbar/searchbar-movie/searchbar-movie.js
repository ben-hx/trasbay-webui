var app = angular.module('myApp.searchbar');

app.controller('SearchbarMovieCtrl', ['$scope', 'EventHandler', 'SearchbarService', 'MovieRepository', function ($scope, EventHandler, SearchbarService, MovieRepository) {

    $scope.init = function () {
        $scope.SearchbarService = SearchbarService;
        MovieRepository.getGenres().then(function (result) {
            $scope.genres = $scope.transformArrayToChecklistModel(result.genres, SearchbarService.data.genres);
        });
        MovieRepository.getActors().then(function (result) {
            $scope.actors = $scope.transformArrayToChecklistModel(result.actors, SearchbarService.data.actors);
        });
    };

    $scope.transformArrayToChecklistModel = function (array, checkedValues) {
        var result = {};
        checkedValues = checkedValues || [];
        angular.forEach(array, function (value, key) {
            result[value] = checkedValues.indexOf(value) >= 0;
        });
        return result;
    };

    $scope.transformCheckListModelToArray = function (model) {
        var result = [];
        angular.forEach(model, function (value, key) {
            if (value) {
                result.push(key);
            }
        });
        return result;
    };

    $scope.searchOnOpen = function () {
        SearchbarService.data.isOpen = true;
        EventHandler.emit('searchbarOpened', SearchbarService.data);
    };

    $scope.searchOnChange = function () {
        EventHandler.emit('searchbarChanged', SearchbarService.data);
    };

    $scope.searchOnSubmit = function () {
        SearchbarService.data.filterIsOpen = false;
        EventHandler.emit('searchbarSubmitted', SearchbarService.data);
    };

    $scope.searchOnCleaned = function () {
        SearchbarService.data.filterIsOpen = false;
        SearchbarService.data.isOpen = false;
        if (SearchbarService.data.searchText != '') {
            $scope.searchOnChange();
        }
        SearchbarService.data.searchText = '';
        EventHandler.emit('searchbarCleared', SearchbarService.data);
    };

    $scope.toggleFilterDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        SearchbarService.data.filterIsOpen = !SearchbarService.data.filterIsOpen;
    };

    $scope.checklistOnChange = function (type, name, value) {
        SearchbarService.data[type] = $scope.transformCheckListModelToArray($scope[type]);
        $scope.searchOnChange();
    };

}]);