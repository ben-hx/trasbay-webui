'use strict';

var app = angular.module('myApp.model');

app.factory('MovieList', ['EventHandler', 'AuthenticationService', function (EventHandler, AuthenticationService) {

    var currentUser = AuthenticationService.getLoggedInUser();

    EventHandler.subscribe('currentUserChanged', function (event, user) {
        currentUser = user;
    });

    function MovieList(data) {
        this.movies = [];
        this.access = 'public';
        for (var attr in data) {
            if (data.hasOwnProperty(attr))
                this[attr] = data[attr];
        }
    }

    MovieList.prototype.isCommentDeletable = function (comment) {
        if (currentUser == null) {
            return false;
        }
        return currentUser.equals(comment.user) || currentUser.isAdmin();
    };

    MovieList.prototype.userIsInEditableList = function (user) {
        for (var index in this.editableUsers) {
            if (this.editableUsers[index].user._id == user._id) {
                return true;
            }
        }
        return false;
    };

    MovieList.prototype.isEditable = function () {
        if (currentUser == null) {
            return false;
        }
        return currentUser.equals(this.createdUser) || currentUser.isAdmin() || this.userIsInEditableList(currentUser);
    };

    MovieList.prototype.addEditableUser = function (user) {
        for (var index in this.editableUsers) {
            if (this.editableUsers[index].user._id == user._id) {
                return;
            }
        }
        this.editableUsers.push({user: user, readOnly: false});
    };

    MovieList.prototype.removeEditableUser = function (user) {
        for (var index in this.editableUsers) {
            if (this.editableUsers[index].user._id == user._id) {
                this.editableUsers.splice(index, 1);
                return true;
            }
        }
        return false;
    };

    MovieList.prototype.addMovie = function (movie) {
        for (var index in this.movies) {
            if (this.movies[index].movie._id == movie._id) {
                return;
            }
        }
        this.movies.push({movie: movie});
    };

    MovieList.prototype.removeMovie = function (movie) {
        for (var index in this.movies) {
            if (this.movies[index].movie._id == movie._id) {
                this.movies.splice(index, 1);
                return true;
            }
        }
        return false;
    };

    MovieList.prototype.toString = function () {
        return this.title;
    };

    return MovieList;
}]);

app.factory('MovieListRepository', ['ErrorHandler', 'MovieList', 'ApiManagerUtil', function (ErrorHandler, MovieList, ApiManagerUtil) {

    function transform(data) {
        data.id = data._id || undefined;
        var result = new MovieList(data);
        return result;
    }

    return {
        getAll: function (params) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieLists',
                        isCollection: true,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.get('movie_lists', params, {}, options);
        },
        getById: function (id) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.get('movie_lists/' + id, {}, {}, options);
        },
        create: function (data) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.create('movie_lists', data, options);
        },
        update: function (data) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.update('movie_lists/' + data.id, data, options);
        },
        delete: function (data) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.delete('movie_lists/' + data.id, options);
        },
        postComment: function (list, comment) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.create('movie_lists/' + list.id + '/comments', {text: comment}, options);
        },
        deleteComment: function (list, comment) {
            var options = {
                elementTransformers: [
                    {
                        keyName: 'movieList',
                        isCollection: false,
                        transformerFunction: transform
                    }
                ]
            };
            return ApiManagerUtil.delete('movie_lists/' + list.id + '/comments/' + comment._id, options);
        }
    };
}]);