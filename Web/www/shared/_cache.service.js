(function () {
  'use strict';

  angular
    .module('services')
    .factory('_cache', ['$http', 'promiseCache', cacheService]);

  function cacheService($http, promiseCache) {
    var service = {};
    var ttl = 120000;

    service.get = function (key, timeToLive) {
      return promiseCache({
        promise: function () { return $http.get(key) },
        key: key,
        ttl: timeToLive || ttl,
        localStorageEnabled: false
      });
    };

    return service;
  }
})();


//caching using $q and $cacheFactory
//var postCache = $cacheFactory('home.service');
//service.getPosts = function (filters) {
//  var url = '/api/posts' + _qs.toQs(filters);
//  var posts = postCache.get(url);
//  if (posts) {
//    return posts;
//  }
//  var defer = $q.defer();
//  $http.get(url).then(function (res) {
//    defer.resolve(res);
//  }, function (res) {
//    defer.reject(res);
//  });
//  postCache.put(url, defer.promise);
//  return defer.promise;
//};
