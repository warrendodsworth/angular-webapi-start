(function () {
  'use strict';

  angular
    .module('services')
    .service('postService', postService);

  postService.$inject = ['$http', 'QsService'];

  function postService($http, qs) {
    var service = {};
    service.getNotes = function (filter) {
      return $http.get('/api/posts' + qs.toQs(filter));
    };
    service.postNote = function (model) {
      return $http.post('/api/posts', model);
    };
    service.deleteNote = function (id) {
      return $http.delete('/api/posts/' + id);
    };
    return service;
  }
}());