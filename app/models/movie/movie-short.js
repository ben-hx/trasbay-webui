var app = angular.module('myApp.model');

app.factory('MovieShort', function () {

    function MovieShort(title, year, poster, imdbId) {
        this.title = title;
        this.year = year;
        this.poster = poster;
        this.imdbId = imdbId;
    }

    return MovieShort;
});