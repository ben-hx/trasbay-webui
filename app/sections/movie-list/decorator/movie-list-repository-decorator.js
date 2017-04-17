var app = angular.module('myApp.movieList');

app.config(function (errorHandlerProvider, $provide) {
    errorHandlerProvider.decorate($provide, ['MovieListRepository']);
});

app.config(['$provide', function ($provide) {
    $provide.decorator('MovieListRepository', ['$delegate', '$q', 'NotificationService', 'ConfirmationViewManager', function ($delegate, $q, NotificationService, ConfirmationViewManager) {

        var toString = function (object) {
            return object.title;
        };

        var create = $delegate.create;
        $delegate.create = function (data) {
            return create(data).then(function (result) {
                NotificationService.pushSuccess({message: 'MovieList  "' + result.toString() + '" created!'});
                return result;
            });
        };

        var update = $delegate.update;
        $delegate.update = function (movie) {
            return update(movie).then(function (result) {
                NotificationService.pushSuccess({message: 'MovieList  "' + result.toString() + '" updated!'});
                return result;
            });
        };

        var delete_ = $delegate.delete;
        $delegate.delete = function (data) {
            return ConfirmationViewManager.show({bodyText: 'Are you sure you want to delete the list "' + data.toString() + '"?'}).then(function () {
                return delete_(data).then(function (result) {
                    NotificationService.pushSuccess({message: 'MovieList  "' + result.toString() + '" deleted!'});
                    return result;
                });
            });
        };

        var postComment = $delegate.postComment;
        $delegate.postComment = function (movie, comment) {
            return postComment(movie, comment).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + result.toString() + '" commented with "' + comment + '"!'});
                return result;
            });
        };

        var deleteComment = $delegate.deleteComment;
        $delegate.deleteComment = function (movie, comment) {
            return ConfirmationViewManager.show({bodyText: 'Are you sure you want to delete the comment?'}).then(function () {
                return deleteComment(movie, comment).then(function (result) {
                    NotificationService.pushSuccess({message: 'Comment deleted"!'});
                    return result;
                });
            });
        };

        return $delegate;
    }]);
}]);