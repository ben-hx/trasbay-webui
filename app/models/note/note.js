var app = angular.module('myApp.model');

app.factory('Note', function () {

    function Note(id, text, category, urls, userId) {
        Object.defineProperty(this, "id", {
           value: id
        });
        this.id = id;
        this.text = text;
        this.category = category;
        this.urls = urls;
        this.userId = userId;
    }

    return Note;
});