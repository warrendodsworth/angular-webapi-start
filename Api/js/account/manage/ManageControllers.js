(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('ManageLoginsController', ManageLoginsController);

  ManageLoginsController.$inject = ['$scope', 'AccountService'];

  function ManageLoginsController() {
    AccountService.getManageLogins().then(function (res) {
      $scope.logins = res.data;
    });

    $scope.removeLogin = function (login, index) {
      AccountService.removeLogin(login).then(function (res) {
        $scope.res = 'Removed';
        $scope.logins.splice(index, 1);
      });
    }
  }

})();