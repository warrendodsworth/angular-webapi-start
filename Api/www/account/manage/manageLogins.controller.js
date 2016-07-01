(function () {
  'use strict';
  angular.module('controllers').controller('manageLoginsController', manageLoginsController);
  manageLoginsController.$inject = [
    '$scope',
    'AccountService'
  ];
  function manageLoginsController($scope, AccountService) {
    AccountService.getManageLogins().then(function (res) {
      $scope.logins = res.data.logins;
      $scope.externalLoginProviders = res.data.externalLoginProviders;
    });
    $scope.removeLogin = function (login, index) {
      AccountService.removeLogin(login).then(function (res) {
        $scope.res = 'Removed';
        $scope.logins.splice(index, 1);
      });
    };
  }
}());