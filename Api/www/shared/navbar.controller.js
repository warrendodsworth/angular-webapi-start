(function () {
  'use strict';
  angular.module('controllers').controller('NavbarController', navbarController);
  navbarController.$inject = [
    '$scope',
    '$location',
    'accountService'
  ];
  function navbarController($scope, $location, accountService) {
    $scope.logout = function () {
      accountService.logout();
      $location.path('/');
    };
  }
}());