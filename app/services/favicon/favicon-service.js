'use strict';

var app = angular.module('myApp.favicon', []);

app.service('FaviconService', ['$q', function ($q) {
    return {
        getFaviconUrlForUrl: function (url, size) {
            if (url === '') {
                return "//:0";
            }
            /* Alternative:
             return "http://www.google.com/s2/favicons?domain="+url+"&size="+size;
             */
            return "https://icons.better-idea.org/icon?url=" + url + "&size=" + size;
        }
    };
}]);