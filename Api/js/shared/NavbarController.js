(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('NavbarController', ['$scope', 'AccountService', NavbarController]);

  function NavbarController($scope, AccountService) {

    $scope.identity = AccountService.identity;

    $scope.logout = function () {
      AccountService.logout();
    }
  }
})();