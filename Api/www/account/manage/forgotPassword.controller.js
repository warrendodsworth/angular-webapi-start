(function () {
  'use strict';
  angular.module('controllers').controller('ForgotPasswordController', forgotPassword);
  forgotPassword.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'accountService'
  ];
  function forgotPassword($scope, $location, $timeout, accountService) {
    $scope.forgotPassword = function (model) {
      accountService.forgotPassword(model).then(function (res) {
        $scope.res = 'We\'ve sent you a link';
        $timeout(function () {
          $location.path('/');
        }, 4000);
      });
    };
  }
}());