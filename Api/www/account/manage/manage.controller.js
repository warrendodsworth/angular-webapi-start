(function () {
  'use strict';
  angular.module('controllers').controller('manageController', manageController);
  manageController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'AccountService'
  ];
  function manageController($scope, $location, $timeout, AccountService) {
    AccountService.getCurrentUser().then(function (res) {
      $scope.user = res.data;
    });
    $scope.deactivate = function () {
      AccountService.deactivateAccount().then(function (res) {
        $scope.res = 'Account Deactivated';
        AccountService.logout();
        $timeout(function () {
          $location.path('/');
        }, 2000);
      });
    };
  }
}());