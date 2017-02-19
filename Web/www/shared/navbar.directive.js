(function () {
  'use strict';

  angular
    .module('app')
    .directive('navbar', navbarDirective)
    .controller('NavbarController', navbarController);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl: '/www/shared/navbar.html',
      controller: 'NavbarController'
    };
  }

  navbarController.$inject = ['$scope', '$http', '$timeout', '$location', '_account'];

  function navbarController($scope, $http, $timeout, $location, _account) {
    var vm = $scope;
    vm.identity = _account.identity;
    vm.logout = function () {
      _account.logout();
      $location.path('/');
    };

    vm.getPosts = function (q) {
      return $http.get('api/posts?search=' + (q || '') + '&show=6').then(function (res) {
        return res.data.items;
      });
    };
  }

}());
