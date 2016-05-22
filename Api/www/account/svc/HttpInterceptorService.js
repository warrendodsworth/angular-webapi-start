(function () {
  'use strict';

  angular
    .module('app')
    .factory('HttpInterceptorService', HttpInterceptorService);

  HttpInterceptorService.$inject = ['$q', '$location', '$rootScope', '$injector', 'localStorageService'];

  function HttpInterceptorService($q, $location, $rootScope, $injector, localStorageService) {

    var service = {};

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    service.responseError = function (res) {
      var rootScope;

      if (res.status === 401) {
        $location.path('/login');
      } else {

        rootScope = $rootScope || $injector.get('$rootScope');

        rootScope.$broadcast('responseError', res);
      }

      return $q.reject(res);
    };

    return service;
  }
})();