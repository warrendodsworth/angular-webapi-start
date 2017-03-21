(function () {
  'use strict';

  angular
    .module('app')
    .factory('_home', ['$http', '$q', '_cache', '_qs', homeService]);

  function homeService($http, $q, _cache, _qs) {
    var service = {};

    service.getPosts = function (filters) {
      return _cache.get('/api/posts' + _qs.toQs(filters));
    };

    service.getPostQR = function (id) {
      return $http.get('/api/posts/' + id + '/qr')
    };

    return service;
  }
})();



