(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('ManageLoginsController', ManageLoginsController);

    ManageLoginsController.$inject = ['$scope', 'AccountService'];

    function ManageLoginsController($scope, AccountService) {
        AccountService.getManageLogins().then(function (res) {
            $scope.logins = res.data.logins;
            $scope.externalLoginProviders = res.data.externalLoginProviders;
        });

        $scope.removeLogin = function (login, index) {
            AccountService.removeLogin(login).then(function (res) {
                $scope.res = 'Removed';
                $scope.logins.splice(index, 1);
            });
        }
    }

    angular
       .module('controllers')
       .controller('ManageController', ManageController);

    ManageController.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ManageController($scope, $location, $timeout, AccountService) {
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
        }
    }

    angular
          .module('controllers')
          .controller('ForgotPasswordController', ForgotPassword);

    ForgotPassword.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ForgotPassword($scope, $location, $timeout, AccountService) {

        $scope.forgotPassword = function (model) {
            AccountService.forgotPassword(model).then(function (res) {
                $scope.res = 'We\'ve sent you a link';

                $timeout(function () {
                    $location.path('/');
                }, 4000);
            }, function (res) {
                $scope.res = res;
            });
        }
    }

})();