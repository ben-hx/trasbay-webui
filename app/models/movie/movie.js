var app = angular.module('myApp.model');

app.factory('Movie', function () {

    function Movie(id, title, year, runtime, genres, directors, writers, actors, plot, languages, country, poster, userCreatedId) {
        Object.defineProperty(this, "id", {
            value: id
        });
        this.id = id;
        this.text = title;
        this.category = year;
        this.urls = runtime;
        this.genres = genres;
        this.directors = directors;
        this.writers = writers;
        this.actors = actors;
        this.plot = plot;
        this.languages = languages;
        this.country = country;
        this.poster = poster;
        this.userCreatedId = userCreatedId;
    }

    return Movie;
});