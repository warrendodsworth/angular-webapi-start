(function () {
  'use strict';
  angular.module('controllers').controller('manageLoginsController', manageLoginsController);
  manageLoginsController.$inject = [
    '$scope',
    'accountService'
  ];
  function manageLoginsController($scope, accountService) {
    accountService.getManageLogins().then(function (res) {
      $scope.logins = res.data.logins;
      $scope.externalLoginProviders = res.data.externalLoginProviders;
    });
    $scope.removeLogin = function (login, index) {
      accountService.removeLogin(login).then(function (res) {
        $scope.res = 'Removed';
        $scope.logins.splice(index, 1);
      });
    };
  }
}());