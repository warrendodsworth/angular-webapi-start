(function () {
  'use strict';

  angular.module('controllers').controller('LoginController', [
    '$scope',
    '$location',
    'AccountService',
    LoginController
  ]);

  function LoginController($scope, $location, AccountService) {
    var vm = $scope;
    vm.$parent.title = 'Wow';

    AccountService.getExternalLogins().then(function (res) {
      vm.logins = res.data;
    });

    vm.login = function (model) {
      AccountService.login(model).then(function (res) {
        $location.path('/').search('m', 'welcome');
      });
    };
  }

})();