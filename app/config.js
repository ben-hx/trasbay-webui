var app = angular.module('myApp.config', []);

app.constant('config', {
    apiUrl: 'http://tacnoc.de/api',
    baseUrl: '/',
    enableDebug: true
});