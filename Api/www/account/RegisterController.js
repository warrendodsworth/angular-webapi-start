(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('RegisterController', registerController);

  registerController.$inject = ['$scope', '$location', '$timeout', 'notifySvc', 'AccountService'];

  function registerController($scope, $location, $timeout, notifySvc, accountService) {

    $scope.register = function (model) {
      accountService.register(model).then(function (res) {
        notifySvc.success('Account created');

        $timeout(function () {
          $location.path('/login');
        }, 2000);

      });
    };
  }
})();
