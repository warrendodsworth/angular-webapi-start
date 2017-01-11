(function () {
  'use strict';
  angular.module('controllers').controller('ForgotPasswordController', forgotPassword);
  forgotPassword.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'AccountService'
  ];
  function forgotPassword($scope, $location, $timeout, AccountService) {
    $scope.forgotPassword = function (model) {
      AccountService.forgotPassword(model).then(function (res) {
        $scope.res = 'We\'ve sent you a link';
        $timeout(function () {
          $location.path('/');
        }, 4000);
      });
    };
  }
}());