(function () {
  'use strict';

  angular.module('ctrls')
    .controller('NavbarCtrl', ['$scope', 'AccountService', NavbarController]);

  function NavbarController($scope, AccountService) {
    $scope.identity = AccountService.identity;

    $scope.logout = function () {
      AccountService.logout();
    }
  }
})();