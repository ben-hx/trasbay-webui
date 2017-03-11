var app = angular.module('myApp.movie');

app.config(function (errorHandlerProvider, $provide) {
    errorHandlerProvider.decorate($provide, ['MovieRepository']);
});

app.config(['$provide', function ($provide) {
    $provide.decorator('MovieRepository', ['$delegate', '$q', 'NotificationService', 'ConfirmationViewManager', function ($delegate, $q, NotificationService, ConfirmationViewManager) {

        var toString = function (object) {
            return object.title;
        };

        var create = $delegate.create;
        $delegate.create = function (movie) {
            return create(movie).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" created!'});
                return result;
            });
        };

        var update = $delegate.update;
        $delegate.update = function (movie) {
            return update(movie).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" updated!'});
                return result;
            });
        };

        var delete_ = $delegate.delete;
        $delegate.delete = function (movie) {
            return ConfirmationViewManager.show({bodyText: 'Are you sure you want to delete the movie "' + toString(movie) + '"?'}).then(function () {
                return delete_(movie).then(function (result) {
                    NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" deleted!'});
                    return result;
                });
            });
        };

        var setWatched = $delegate.setWatched;
        $delegate.setWatched = function (movie, value) {
            var what = (value ? 'watched' : 'unwatched');
            return setWatched(movie, value).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" set to ' + what + '!'});
                return result;
            });
        };

        var setRating = $delegate.setRating;
        $delegate.setRating = function (movie, value) {
            return setRating(movie, value).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" rated!'});
                return result;
            });
        };

        var postComment = $delegate.postComment;
        $delegate.postComment = function (movie, comment) {
            return postComment(movie, comment).then(function (result) {
                NotificationService.pushSuccess({message: 'Movie  "' + toString(result) + '" commented with "' + comment + '"!'});
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