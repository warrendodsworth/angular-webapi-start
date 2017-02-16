(function () {
  'use strict';

  angular.module('controllers').controller('LoginController', [
    '$scope',
    '$location',
    'account',
    LoginController
  ]);

  function LoginController($scope, $location, _account) {
    var vm = $scope;
    vm.$parent.title = 'Wow';

    _account.getExternalLogins().then(function (res) {
      vm.logins = res.data;
    });

    vm.login = function (model) {
      _account.login(model).then(function (res) {
        $location.path('/').search('m', 'welcome');
      });
    };
  }

})();