(function () {
  'use strict';

  angular.module('controllers').controller('IndexController', indexController);

  indexController.$inject = ['$scope','config', '_home', '_qs'];

  function indexController($scope, config, _home, _qs) {
    var vm = $scope;
    vm.$parent.title = 'Wow';
    vm.posts = { items: [] };
    vm.filters = _qs.toFilters();

    vm.getPosts = function () {
      _home.getPosts(vm.filters).then(function (res) {
        vm.posts = res.data;
      })
    };
    vm.getPosts();

    vm.popoverUser = function (user) {
      vm.popover = {
        templateUrl: config.userPopover,
        user: user
      };
      return vm.popover.templateUrl;
    };
  }
}());