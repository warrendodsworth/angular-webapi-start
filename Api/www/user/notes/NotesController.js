(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('Notes.IndexController', NotesController);

  NotesController.$inject = ['$scope', '$http', '$location', 'QuerystringService', 'NoteService'];

  function NotesController($scope, $http, $location, Qs, NoteService) {
    var vm = $scope;
    vm.filters = Qs.toFilters();

    vm.$watch('filters', function (val) {
      Qs.toQs(vm.filters);
    }, true);

    vm.pageChanged = function () {
      NoteService.getNotes(vm.filters).then(function (res) {
        vm.notes = res.data.items;
        vm.total = res.data.total;
      });
    }
    vm.pageChanged();

    vm.create = function (model) {
      NoteService.postNote(model).then(function (res) {
        vm.res = 'Note Created';
        vm.filters.action = 'list';
      });
    };

    vm.delete = function (note, index) {
      NoteService.deleteNote(note.id).then(function (res) {
        vm.notes.splice(index, 1);
        vm.res = 'Deleted';
      });
    };
  }
})();