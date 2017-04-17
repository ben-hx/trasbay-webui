var app = angular.module('myApp.home');

app.controller('MovieWithParamsCtrl', ['$scope', '$state', 'MovieRepository', 'params', function ($scope, $state, MovieRepository, params) {

    $scope.init = function () {
        $scope.reload();
    };

    $scope.reload = function () {
        $scope.whileLoading = true;
        MovieRepository.getAll(params).then(function (data) {
            $scope.whileLoading = false;
            $scope.movies = data.movies;
        });
    };

    $scope.show = function (index) {
        var data = $scope.movies[index];
        $state.transitionTo('updatemovie', {movieId: data.id, edit: false, destinationState: $state.current});
    };

}]);