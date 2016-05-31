(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('NavbarController', ['$scope', '$location', 'AccountService', navbarController]);

  function navbarController($scope, $location, accountService) {
    
    $scope.logout = function () {
      accountService.logout();
      $location.path('/');
    }
  }
})();