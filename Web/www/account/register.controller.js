(function () {
  'use strict';
  angular.module('controllers').controller('RegisterController', RegisterController);
  RegisterController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    '_notify',
    '_account'
  ];
  function RegisterController($scope, $location, $timeout, _notify, _account) {
    $scope.register = function (model) {
      _account.register(model).then(function (res) {
        _notify.success('Account created');
        $timeout(function () {
          $location.path('/login');
        }, 2000);
      });
    };
  }
}());