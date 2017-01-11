(function () {
  'use strict';
  angular.module('controllers').controller('RegisterController', RegisterController);
  RegisterController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'NotifyService',
    'AccountService'
  ];
  function RegisterController($scope, $location, $timeout, NotifyService, AccountService) {
    $scope.register = function (model) {
      AccountService.register(model).then(function (res) {
        NotifyService.success('Account created');
        $timeout(function () {
          $location.path('/login');
        }, 2000);
      });
    };
  }
}());