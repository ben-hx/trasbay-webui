'use strict';

var app = angular.module('myApp.model');


app.factory('ApiManagerUtil', ['$q', '$http', 'ErrorHandler', function ($q, $http, ErrorHandler) {

    var baseUrl = 'http://localhost:8080/v1';
    var authenticationHeader;

    var transformResponseBody = function (responseBody, options) {
        var result = responseBody;
        if (options.elementTransformers) {
            angular.forEach(options.elementTransformers, function (transformer) {
                var element = (transformer.directWithoutKeyName ? responseBody : responseBody[transformer.keyName]);
                if (transformer.isCollection) {
                    result[transformer.keyName] = angular.forEach(element, function (item) {
                        if (transformer.transformerFunction) {
                            item = transformer.transformerFunction(item);
                        }
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

    var request = function (data) {
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
            deferred.reject(ErrorHandler.getErrorFromResponse(error));
        });
        return deferred.promise;
    };

    return {
        setDefaultHeaders: function (header) {
            authenticationHeader = header;
        },
        get: function (resourceURI, params, options) {
            return request({method: 'GET', resourceURI: resourceURI, params: params, data: {}, options: options});
        },
        create: function (resourceURI, data, options) {
            return request({method: 'POST', resourceURI: resourceURI, params: {}, data: data, options: options});
        },
        set: function (resourceURI, options) {
            return request({method: 'PUT', resourceURI: resourceURI, params: {}, data: {}, options: options});
        },
        update: function (resourceURI, data, options) {
            return request({method: 'PUT', resourceURI: resourceURI, params: {}, data: data, options: options});
        },
        delete: function (resourceURI, data, options) {
            return request({method: 'DELETE', resourceURI: resourceURI, params: {}, data: {}, options: options});
        }
    };
}]);