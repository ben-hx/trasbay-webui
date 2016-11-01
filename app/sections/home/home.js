'use strict';

var app = angular.module('myApp.home', ['ngRoute', 'myApp.model', 'myApp.favicon', 'myApp.note-view-service']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'sections/home/home.html',
        controller: 'HomeCtrl'
    });
}]);

app.controller('HomeCtrl', ['$scope', '$timeout', 'FaviconService', 'NoteRepository', 'NoteViewManager', function ($scope, $timeout, FaviconService, NoteRepository, NoteViewManager) {

    $scope.loadNotes = function () {
        NoteRepository.getAll().then(function (notes) {
            $scope.notes = notes;
        });
    };

    $scope.loadNotes();

    $scope.editing = false;
    $scope.edit = function (note, editing) {
        note.editing = editing;
    };

    $scope.addNote = function () {
        NoteViewManager.create().then(function () {
            $scope.loadNotes();
        });
    };

    $scope.editNote = function (note) {
        NoteViewManager.edit(note).then(function () {
            $scope.loadNotes();
        });
    };

    $scope.deleteNote = function (note) {
        NoteRepository.delete(note).then(function (response) {
            $scope.notes.splice($scope.notes.indexOf(note), 1);
        });
    };

    $scope.updateNoteTasks = [];

    $scope.deleteUpdateTasksForNote = function (note) {
        angular.forEach($scope.updateNoteTasks, function (task, key) {
            if (task.id == note.id) {
                $timeout.cancel(task.timeout);
                $scope.updateNoteTasks.splice(key, 1);
            }
        });
    };

    $scope.updateNote = function (note) {
        return NoteRepository.update(note);
    };

    $scope.changeNote = function (note) {
        console.log("changed");
        $scope.deleteUpdateTasksForNote(note);
        var timeout = $timeout(function () {
            $scope.updateNote(note);
        }, 3000);
        $scope.updateNoteTasks.push({id: note.id, timeout: timeout});
    };

    $scope.showNewUrlInput = function (note) {
        note.newUrl = "";
        note.newUrlInputVisible = true;
    };

    $scope.addNewUrl = function (note, newUrl) {
        var updatedNote = angular.copy(note);
        updatedNote.id = note.id;
        updatedNote.urls.push(newUrl);
        $scope.updateNote(updatedNote).then(function (respondedNote) {
            note.newUrlInputVisible = false;
            note.urls.push(newUrl);
            console.log(note);
        });
    };

    $scope.deleteNoteUrl = function (note, index) {
        var updatedNote = angular.copy(note);
        updatedNote.id = note.id;
        updatedNote.urls.splice(index, 1);
        $scope.updateNote(updatedNote).then(function (respondedNote) {
            note.urls.splice(index, 1);
        });
    };

    $scope.maxNodeUrls = 3;
    $scope.faviconSize = 32;
    $scope.getFaviconUrlForUrl = FaviconService.getFaviconUrlForUrl;
}]);