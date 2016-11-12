var app = angular.module('myApp.searchbar', []);

app.service('SearchbarService', function () {

    return {
        showSearchbar: false,
        searchData: {},
        searchOnChange: function (submit) {
            console.log(submit, this.searchData);
        }
    };
});