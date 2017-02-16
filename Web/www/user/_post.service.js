(function () {
  'use strict';

  angular
    .module('services')
    .service('user.post', postService);

  postService.$inject = ['$http', 'qs'];

  function postService($http, qs) {
    var service = {};
    var url = '/api/user/';

    service.getPosts = function (filter) {
      return $http.get(url + 'posts' + qs.toQs(filter));
    };

    service.putPost = function (model) {
      return $http.put(url + 'posts/' + model.id, model);
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