(function () {
    'use strict';

    angular
      .module('app')
      .directive('navbar', navbarDirective)
      .controller('NavbarController', navbarController);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl:'/www/shared/navbar.html',
      controller: 'NavbarController'
    };
  }

  navbarController.$inject = ['$scope', '$location', 'AccountService'];
  function navbarController($scope, $location, AccountService) {
    $scope.identity = AccountService.identity;
    $scope.logout = function () {
      AccountService.logout();
      $location.path('/');
    };
  }

}());