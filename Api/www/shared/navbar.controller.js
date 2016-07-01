(function () {
  'use strict';
  angular.module('controllers').controller('NavbarController', navbarController);
  navbarController.$inject = [
    '$scope',
    '$location',
    'AccountService'
  ];
  function navbarController($scope, $location, AccountService) {
    $scope.logout = function () {
      AccountService.logout();
      $location.path('/');
    };
  }
}());