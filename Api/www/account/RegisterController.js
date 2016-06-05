(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('registerController', registerController);

  registerController.$inject = ['$scope', '$location', '$timeout', 'notifySvc', 'accountService'];

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
