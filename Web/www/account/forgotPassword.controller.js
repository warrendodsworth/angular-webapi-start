(function () {
  'use strict';
  angular.module('controllers').controller('ForgotPasswordController', forgotPassword);
  forgotPassword.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'account'
  ];
  function forgotPassword($scope, $location, $timeout, _account) {
    $scope.forgotPassword = function (model) {
      _account.forgotPassword(model).then(function (res) {
        $scope.res = 'We\'ve sent you a link';
        $timeout(function () {
          $location.path('/');
        }, 4000);
      });
    };
  }
}());