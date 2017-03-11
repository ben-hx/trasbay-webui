'use strict';

var app = angular.module('myApp.model');


app.factory('ApiManagerUtil', ['$q', '$http', 'ErrorHandler', 'ApiIsOfflineError', function ($q, $http, ErrorHandler, ApiIsOfflineError) {

    var baseUrl = 'https://benhx.kaus.uberspace.de/api/v1';
    var authenticationHeader;

    var transformResponseBody = function (responseBody, options) {
        var result = responseBody;
        if (options.elementTransformers) {
            angular.forEach(options.elementTransformers, function (transformer) {
                var element = (transformer.directWithoutKeyName ? responseBody : responseBody[transformer.keyName]);
                if (transformer.isCollection) {
                    result[transformer.keyName] = element.map(function (item) {
                        if (transformer.transformerFunction) {
                            item = transformer.transformerFunction(item);
                        }
                        return item;
                    });
                } else {
                    if (transformer.transformerFunction) {
                        result = transformer.transformerFunction(element);
                    }
                }
            });
        }
        return result;
    };

    return {
        request: function (data) {
            var deferred = $q.defer();
            $http({
                method: data.method,
                headers: authenticationHeader,
                data: data.data,
                params: data.params,
                url: baseUrl + '/' + data.resourceURI
            }).then(function (response) {
                var result = transformResponseBody(response.data.data, data.options);
                deferred.resolve(result);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        setDefaultHeaders: function (header) {
            authenticationHeader = header;
        },
        get: function (resourceURI, params, data, options) {
            return this.request({
                method: 'GET',
                resourceURI: resourceURI,
                params: params,
                data: data,
                options: options
            });
        },
        create: function (resourceURI, data, options) {
            return this.request({method: 'POST', resourceURI: resourceURI, params: {}, data: data, options: options});
        },
        set: function (resourceURI, options) {
            return this.request({method: 'PUT', resourceURI: resourceURI, params: {}, data: {}, options: options});
        },
        update: function (resourceURI, data, options) {
            return this.request({method: 'PUT', resourceURI: resourceURI, params: {}, data: data, options: options});
        },
        delete: function (resourceURI, options) {
            return this.request({method: 'DELETE', resourceURI: resourceURI, params: {}, data: {}, options: options});
        }
    };
}]);