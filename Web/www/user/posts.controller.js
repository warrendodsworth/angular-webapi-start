(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('posts.IndexController', postsController);

  postsController.$inject = ['$scope', '$http', '$location', 'NotifyService', 'QsService', 'postService'];

  function postsController($scope, $http, $location, NotifyService, qs, postService) {
    var vm = $scope;
    vm.model = {};
    vm.filters = qs.toFilters();
  
    vm.getPosts = function () {
      postService.getPosts(vm.filters).then(function (res) {
        vm.posts = res.data;
      });
    };
    vm.getPosts();

    vm.create = function (model) {
      postService.postPost(model).then(function (res) {
        NotifyService.success('Created');
        vm.posts.items.push(res.data);
        vm.filters.action = 'list'; 
      });
    };

    vm.edit = function (model) {
      vm.model = angular.copy(model);
    };

    vm.update = function (model) {
      postService.putPost(model).then(function (res) {
        NotifyService.success('Saved');
        vm.filters.action = 'list';
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