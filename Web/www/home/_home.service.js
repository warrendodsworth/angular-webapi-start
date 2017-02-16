(function () {
  'use strict';

  angular
    .module('app')
    .factory('home', ['$http', '$q', '$cacheFactory', 'qs', homeService]);

  function homeService($http, $q, $cacheFactory, _qs) {
    var service = {};
    var postCache = $cacheFactory('home.service');

    service.getPosts = function (filters) {
      var url = '/api/posts' + _qs.toQs(filters);
      var posts = postCache.get(url);
      if (posts) {
        return posts;
      }

      var defer = $q.defer();

      $http.get(url).then(function (res) {
        defer.resolve(res);
      }, function (res) {
        defer.reject(res);
      });

      postCache.put(url, defer.promise);

      return defer.promise;
    };

    return service;
  }
})();

