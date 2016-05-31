(function () {
  'use strict';

  angular
    .module('controllers')
    .controller('ManageLoginsController', manageLoginsController);

  manageLoginsController.$inject = ['$scope', 'AccountService'];

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
    }
  }

  angular
     .module('controllers')
     .controller('ManageController', manageController);

  manageController.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

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
    }
  }

  angular
        .module('controllers')
        .controller('ForgotPasswordController', forgotPassword);

  forgotPassword.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

  function forgotPassword($scope, $location, $timeout, accountService) {

    $scope.forgotPassword = function (model) {
      accountService.forgotPassword(model).then(function (res) {
        $scope.res = 'We\'ve sent you a link';

        $timeout(function () {
          $location.path('/');
        }, 4000);
      });
    }
  }

})();