(function () {
  'use strict';

  angular
    .module('services')
    .service('NoteService', ['$http', 'QsSvc', noteService]);

  function noteService($http, qs) {

    this.getNotes = function (filter) {
      return $http.get('/api/notes' + qs.toQs(filter));
    }

    this.postNote = function (model) {
      return $http.post('/api/notes', model);
    }

    this.deleteNote = function (id) {
      return $http.delete('/api/notes/' + id);
    }

  }
})();