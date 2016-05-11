(function () {
  'use strict';

  angular
    .module('services')
    .service('NoteService', ['$http', 'QuerystringService', NoteService]);

  function NoteService($http, Qs) {

    this.getNotes = function (filter) {
      return $http.get('/api/notes' + Qs.toQs(filter));
    }

    this.deleteNote = function (id) {
      return $http.delete('/api/notes/' + id);
    }

  }
})();