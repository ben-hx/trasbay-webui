'use strict';

var app = angular.module('myApp.model');

app.factory('ApiManagerUtil', ['$q', 'Restangular', 'ErrorHandler', function ($q, Restangular, ErrorHandler) {
    return {
        setDefaultHeaders: function (header) {
            Restangular.setDefaultHeaders(header);
        },
        getCollection: function (resourceBaseURI, params, options) {
            var deferred = $q.defer();
            var result = [];
            var self = this;
            Restangular.one(resourceBaseURI).get().then(function (response) {
                if (options.responseSuccessSingleInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    _.forEach(response, function (singleResponse) {
                        result.push(options.responseSuccessSingleInterceptor(singleResponse));
                    });
                }
                if (options.responseSuccessCollectionInterceptor) {
                    options.responseSuccessCollectionInterceptor(response);
                }
                deferred.resolve(result);
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        getSingle: function (resourceBaseURI, options) {
            var deferred = $q.defer();
            var self = this;
            Restangular.one(resourceBaseURI).get().then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        getSingleById: function (resourceBaseURI, id, options) {
            var deferred = $q.defer();
            var self = this;
            Restangular.one(resourceBaseURI, id).get().then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        create: function (resourceBaseURI, data, options) {
            var deferred = $q.defer();
            var self = this;
            data = angular.toJson(data, true);
            Restangular.all(resourceBaseURI).post(data).then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        set: function (resourceBaseURI, options) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI);
            dao.put().then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        update: function (resourceBaseURI, data, options) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI);
            angular.extend(dao, data);
            dao.put().then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        delete: function (resourceBaseURI, data, options) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI);
            dao.remove().then(function (response) {
                if (options.responseSuccessInterceptor) {
                    if (options.responseBodyKey) {
                        response = response[options.responseBodyKey]
                    }
                    deferred.resolve(options.responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (options.responseErrorInterceptior) {
                    options.responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        }
    };
}]);