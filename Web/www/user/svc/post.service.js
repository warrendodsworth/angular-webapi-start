(function () {
  'use strict';

  angular
    .module('services')
    .service('postService', postService);

  postService.$inject = ['$http', 'QsService'];

  function postService($http, qs) {
    var service = {};
    var url = '/api/user/';

    service.getPosts = function (filter) {
      return $http.get(url + 'posts' + qs.toQs(filter));
    };

    service.postPost = function (model) {
      return $http.post(url + 'posts', model);
    };

    service.deletePost = function (id) {
      return $http.delete(url + 'posts/' + id);
    };

    return service;
  }
}());