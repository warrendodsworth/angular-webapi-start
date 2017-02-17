(function () {
  'use strict';

  angular
    .module('app')
    .factory('home', ['$http', '$q', '$cacheFactory', 'promiseCache', 'qs', homeService]);

  function homeService($http, $q, $cacheFactory, promiseCache, _qs) {
    var service = {};
    
    service.getPosts = function (filters) {
      var url = '/api/posts' + _qs.toQs(filters);
      return promiseCache({
        promise: function () { return $http.get(url) },
        key: url,
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


