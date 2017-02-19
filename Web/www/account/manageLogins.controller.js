(function () {
  'use strict';
  angular.module('controllers').controller('manageLoginsController', manageLoginsController);
  manageLoginsController.$inject = [
    '$scope',
    '_account'
  ];
  function manageLoginsController($scope, _account) {
    _account.getManageLogins().then(function (res) {
      $scope.logins = res.data.logins;
      $scope.externalLoginProviders = res.data.externalLoginProviders;
    });
    $scope.removeLogin = function (login, index) {
      _account.removeLogin(login).then(function (res) {
        $scope.res = 'Removed';
        $scope.logins.splice(index, 1);
      });
    };
  }
}());