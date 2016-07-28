(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('posts.IndexController', notesController);

  notesController.$inject = ['$scope', '$http', '$location', 'NotifyService', 'QsService', 'postService'];

  function notesController($scope, $http, $location, NotifyService, qs, postService) {
    var vm = $scope;
    vm.action = 'list';

    vm.filters = qs.toFilters();
    vm.$watch('filters', function (val) {
      qs.toQs(vm.filters);
    }, true);

    vm.pageChanged = function () {
      postService.getPosts(vm.filters).then(function (res) {
        vm.posts = res.data;
      });
    };
    vm.pageChanged();

    vm.create = function (model) {
      postService.postPost(model).then(function (res) {
        NotifyService.success('Note Created');
        vm.posts.items.push(res.data);
        vm.action = 'list';
      });
    };

    vm.delete = function (item, index) {
      postService.deletePost(item.id).then(function (res) {
        vm.posts.items.splice(index, 1);
        NotifyService.success('Deleted');
      });
    };
  }
}());