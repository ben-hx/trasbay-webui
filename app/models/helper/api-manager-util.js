'use strict';

var app = angular.module('myApp.model');

app.factory ('ApiManagerUtil', ['$q', 'Restangular' ,'ErrorHandler', function ($q, Restangular, ErrorHandler) {
    return {
        setDefaultHeaders: function(header) {
            Restangular.setDefaultHeaders(header);
        },
        getCollection: function (resourceBaseURI, params, responseSuccessSingleInterceptor, responseSuccessCollectionInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var result = [];
            var self = this;
            Restangular.one(resourceBaseURI).get().then(function(response) {
                if (responseSuccessSingleInterceptor) {
                    _.forEach(response[resourceBaseURI], function(singleResponse) {
                        result.push(responseSuccessSingleInterceptor(singleResponse));
                    });
                }
                if (responseSuccessCollectionInterceptor) {
                    responseSuccessCollectionInterceptor(response);
                }
                deferred.resolve(result);
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        getSingle: function (resourceBaseURI, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            Restangular.one(resourceBaseURI).get().then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        getSingleById: function (resourceBaseURI, id, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            Restangular.one(resourceBaseURI, id).get().then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        create: function (resourceBaseURI, data, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            data = angular.toJson(data, true);
            Restangular.all(resourceBaseURI).post(data).then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        set: function (resourceBaseURI, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI);
            dao.put().then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        update: function (resourceBaseURI, data, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI, data.id);
            angular.extend(dao, data);
            dao.put().then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        },
        delete: function (resourceBaseURI, data, responseSuccessInterceptor, responseErrorInterceptior) {
            var deferred = $q.defer();
            var self = this;
            var dao = Restangular.one(resourceBaseURI, data.id);
            dao.remove().then(function(response) {
                if (responseSuccessInterceptor) {
                    deferred.resolve(responseSuccessInterceptor(response));
                }
            }, function (error) {
                if (responseErrorInterceptior) {
                    responseErrorInterceptior(error);
                }
                deferred.reject(ErrorHandler.getErrorFromResponse(error));
            });
            return deferred.promise;
        }
    };
}]);