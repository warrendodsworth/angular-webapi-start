(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('posts.IndexController', postsController);

  postsController.$inject = ['$scope', '$http', '$location', '_notify', '_qs', 'user.post'];

  function postsController($scope, $http, $location, _notify, _qs, _post) {
    var vm = $scope;
    vm.model = {};
    vm.filters = _qs.toFilters();
  
    vm.getPosts = function () {
      _post.getPosts(vm.filters).then(function (res) {
        vm.posts = res.data;
      });
    };
    vm.getPosts();

    vm.create = function (model) {
      _post.postPost(model).then(function (res) {
        _notify.success('Created');
        vm.posts.items.push(res.data);
        vm.filters.action = 'list'; 
      });
    };

    vm.edit = function (model) {
      vm.model = angular.copy(model);
    };

    vm.update = function (model) {
      _post.putPost(model).then(function (res) {
        _notify.success('Saved');
        vm.filters.action = 'list';
      });
    };

    vm.delete = function (item, index) {
      _post.deletePost(item.id).then(function (res) {
        vm.posts.items.splice(index, 1);
        _notify.success('Deleted');
      });
    };
  }
}());