(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('LoginController', ['$scope', '$location', 'AccountService', loginController]);

  function loginController($scope, $location, accountService) {

    accountService.getExternalLogins().then(function (res) {
      $scope.logins = res.data;
    });

    $scope.login = function (model) {
      accountService.login(model).then(function (res) {
        $location.path('/').search('m', 'welcome');
      });
    };
  }

})();
