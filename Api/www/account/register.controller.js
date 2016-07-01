(function () {
  'use strict';
  angular.module('controllers').controller('registerController', registerController);
  registerController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'notifyService',
    'accountService'
  ];
  function registerController($scope, $location, $timeout, notifyService, accountService) {
    $scope.register = function (model) {
      accountService.register(model).then(function (res) {
        notifyService.success('Account created');
        $timeout(function () {
          $location.path('/login');
        }, 2000);
      });
    };
  }
}());