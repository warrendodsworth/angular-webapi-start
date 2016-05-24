(function () {
  'use strict';

  angular
    .module('services')
    .service('NoteService', ['$http', 'QsSvc', NoteService]);

  function NoteService($http, Qs) {

    this.getNotes = function (filter) {
      return $http.get('/api/notes' + Qs.toQs(filter));
    }

    this.postNote = function (model) {
      return $http.post('/api/notes', model);
    }

    this.deleteNote = function (id) {
      return $http.delete('/api/notes/' + id);
    }

  }
})();