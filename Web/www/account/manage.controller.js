(function () {
  'use strict';

  angular.module('controllers').controller('manageController', manageController);
  manageController.$inject = ['$scope', '$location', '$timeout', 'Upload', '_account', '_notify'];

  function manageController($scope, $location, $timeout, Upload, _account, _notify) {
    _account.getCurrentUser().then(function (res) {
      $scope.user = res.data;
    });

    $scope.deactivate = function () {
      _account.deactivateAccount().then(function (res) {
        $scope.res = 'Account Deactivated';
        _account.logout();
        $timeout(function () {
          $location.path('/');
        }, 2000);
      });
    };
  }

}());