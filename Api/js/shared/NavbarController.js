(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('NavbarController', ['$scope', '$location', 'AccountService', NavbarController]);

  function NavbarController($scope, $location, AccountService) {
    
    $scope.logout = function () {
      AccountService.logout();
      $location.path('/');
    }
  }
})();