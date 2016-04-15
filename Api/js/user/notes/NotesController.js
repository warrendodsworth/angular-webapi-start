(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('Notes.IndexController', NotesController);

  NotesController.$inject = ['$scope', '$http', '$location', 'QuerystringService', 'NoteService'];

  function NotesController($scope, $http, $location, Qs, NoteService) {
    var vm = $scope;

    vm.filters = Qs.toFilters();

    vm.pageChanged = function () {
      NoteService.getNotes(vm.filters).then(function (res) {
        vm.notes = res.data.items;
        vm.total = res.data.total;
      });
    }
    vm.pageChanged();


    vm.delete = function (note, index) {
      NoteService.deleteNote(note.id).then(function (res) {
        vm.notes.splice(index, 1);
        vm.res = 'Deleted';
      });
    };
  }
})();