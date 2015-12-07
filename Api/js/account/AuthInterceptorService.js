(function () {
  'use strict';

  angular.module('app')
         .factory('AuthInterceptorService', ['$q', '$location', 'localStorageService', AuthInterceptorService]);

  function AuthInterceptorService($q, $location, localStorageService) {

    var service = {};

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    service.responseError = function (rejection) {
      if (rejection.status === 401) {
        $location.path('/login');
      }
      return $q.reject(rejection);
    };

    return service;
  }
})