(function() {
  'use strict';
  angular.module('services').service('noteService', [
    '$http',
    'qsSvc',
    noteService
  ]);
  function noteService($http, qs) {
    var service = {};
    service.getNotes = function(filter) {
      return $http.get('/api/notes' + qs.toQs(filter));
    };
    service.postNote = function(model) {
      return $http.post('/api/notes', model);
    };
    service.deleteNote = function(id) {
      return $http.delete('/api/notes/' + id);
    };
    return service;
  }
}());
