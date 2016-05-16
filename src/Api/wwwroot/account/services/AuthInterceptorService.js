(function () {
  'use strict';

  angular
    .module('app')
    .factory('AuthInterceptorService', AuthInterceptorService);

  AuthInterceptorService.$inject = ['$q', '$location', '$injector', 'localStorageService'];

  function AuthInterceptorService($q, $location, $injector, localStorageService) {

    var service = {};
    var $http, rootScope;

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    service.responseError = function (res) {
      if (res.status === 401) {
        $location.path('/login');
      } else {
        $http = $http || $injector.get('$http');
        if ($http.pendingRequests.length < 1) {
          rootScope = rootScope || $injector.get('$rootScope');
          rootScope.$broadcast('responseError', res);
        }
      }

      return $q.reject(res);
    };

    service.response = function (res) {
      return res;
    }

    return service;
  }
})();