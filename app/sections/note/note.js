var app = angular.module('myApp.note-view-service', []);

app.factory('NoteViewManager', ['$q', '$uibModal', function($q, $uibModal) {
    var deferredResult = null;

    var handleSuccessfulEdition = function () {
        deferredResult.resolve();
    };

    var handleUnsuccessfulEdition = function () {
        deferredResult.reject();
    };

    var handleEditing = function (note, create) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'sections/note/note.html',
            controller: 'NoteCtrl',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                data: {
                    note: note,
                    create: create
                }
            }
        });
        modalInstance.result.then(handleSuccessfulEdition, handleUnsuccessfulEdition);
    };

    return {
        create: function () {
            deferredResult = $q.defer();
            handleEditing({text: "", category: "", urls: []}, true);
            return deferredResult.promise;
        },
        edit: function (note) {
            deferredResult = $q.defer();
            handleEditing(note, false);
            return deferredResult.promise;
        }
    };

}]);

app.controller('NoteCtrl', ['$scope', '$uibModalInstance', '$q', 'FaviconService', 'NoteRepository', 'CategoryRepository', 'data', function ($scope, $uibModalInstance, $q, FaviconService, NoteRepository, CategoryRepository, data) {
    $scope.copy = function (note) {
        var result = angular.copy(note);
        result.id = note.id;
        return result;
    }

    $scope.faviconSize = 32;
    $scope.getFaviconUrlForUrl = FaviconService.getFaviconUrlForUrl;
    $scope.dataLoading = false;
    $scope.error = {show: false, message: ""};
    $scope.note = $scope.copy(data.note);
    $scope.created = !data.create;

    $scope.save = function (note) {
        var updatedNote = $scope.copy(note);
        $scope.addNewUrl(updatedNote, updatedNote.newUrl);
        $scope.createOrUpdate(updatedNote).then(function (newNote) {
            $uibModalInstance.close(newNote);
        });
    };

    $scope.cancel = function () {
        if (data.create && $scope.created) {
            NoteRepository.delete($scope.note);
        }
        if (!data.create) {
            NoteRepository.update(data.note);
        }
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addNewUrl = function(note, newUrl) {
        if (newUrl && newUrl != '') {
            note.urls.push(newUrl);
        }
        return note;
    }

    $scope.addMoreUrls = function(note) {
        var updatedNote = $scope.copy(note);
        $scope.addNewUrl(updatedNote, updatedNote.newUrl);
        $scope.createOrUpdate(updatedNote);
    }

    $scope.createOrUpdate = function (note) {
        $scope.dataLoading = true;
        var deferred = $q.defer();
        var interceptedPromise;
        if (!$scope.created) {
            interceptedPromise = NoteRepository.create(note.text, note.category, note.urls);
        } else {
            interceptedPromise = NoteRepository.update(note);
        }
        interceptedPromise.then(function (newNote) {
            $scope.created = true;
            $scope.note = newNote;
            $scope.error.show = false;
            deferred.resolve(newNote);
        }, function (error) {
            $scope.error.show = true;
            $scope.error.message = error.message;
            deferred.reject(error);
        }).finally(function () {
            $scope.dataLoading = false;
        });
        return deferred.promise;
    };

    $scope.deleteNoteUrl = function(note, index) {
        if (index === 0) {
            NoteRepository.delete($scope.note).then(function (respondedNote) {
                $scope.created = false;
                note.urls.splice(index, 1);
            });
            return;
        }
        var updatedNote = $scope.copy(note);
        updatedNote.urls.splice(index, 1);
        $scope.createOrUpdate(updatedNote).then(function (respondedNote) {
            note.urls.splice(index, 1);
        });
    };

    $scope.getCategories = function(val) {
        return CategoryRepository.getAll().then(function(response){
            return response.map(function(item){
                return item;
            });
        });
    };

}]);