(function () {
  'use strict';

  angular.module('controllers').controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$http', '$location', 'QsService'];

  function IndexController($scope, $http, $location, Qs) {
    var vm = $scope;
    vm.$parent.title = 'Wow';
    vm.posts = { items: [] };
    vm.filters = Qs.toFilters();

    vm.getPosts = function () {
      $http.get('/api/posts' + Qs.toQs(vm.filters)).then(function (res) {
        vm.posts.items = res.data.items;
        vm.posts.total = res.data.total;
      });
    };
    vm.getPosts();
  }
}());