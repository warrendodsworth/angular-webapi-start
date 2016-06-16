(function () {
  'use strict';
  angular.module('controllers').controller('manageController', manageController);
  manageController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'accountService'
  ];
  function manageController($scope, $location, $timeout, accountService) {
    accountService.getCurrentUser().then(function (res) {
      $scope.user = res.data;
    });
    $scope.deactivate = function () {
      accountService.deactivateAccount().then(function (res) {
        $scope.res = 'Account Deactivated';
        accountService.logout();
        $timeout(function () {
          $location.path('/');
        }, 2000);
      });
    };
  }
}());