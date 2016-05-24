(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$scope', '$location', '$timeout', 'notifySvc', 'AccountService'];

  function RegisterController($scope, $location, $timeout, notifySvc, AccountService) {

    $scope.register = function (model) {
      AccountService.register(model).then(function (res) {
        notifySvc.success('Account created');

        $timeout(function () {
          $location.path('/login');
        }, 2000);

      });
    };
  }
})();
