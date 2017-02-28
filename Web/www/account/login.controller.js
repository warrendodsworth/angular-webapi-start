(function () {
  'use strict';

  angular.module('controllers').controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$location', '_account'];

  function LoginController($scope, $location, _account) {
    var vm = $scope;
    vm.$parent.title = 'Wow';
    var returnUrl = $location.search()['returnUrl'];

    _account.getExternalLogins().then(function (res) {
      vm.logins = res.data;
    });

    vm.login = function (model) {
      _account.login(model).then(function (res) {
        if (returnUrl) {
          $location.path(returnUrl).search({});
          return;
        }

        $location.path('/').search('m', 'welcome');
      });
    };
  }

})();