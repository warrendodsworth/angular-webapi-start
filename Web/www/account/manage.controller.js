(function () {
  'use strict';

  angular.module('controllers').controller('manageController', manageController);

  manageController.$inject = ['$scope', '$location', '$timeout', 'Upload', '_account', '_notify'];

  function manageController($scope, $location, $timeout, Upload, _account, _notify) {
    var vm = $scope;

    _account.getMe().then(function (res) {
      vm.user = res.data;
    });

    vm.deactivate = function () {
      _account.deactivateAccount().then(function (res) {
        _notify.success('Account Deactivated');
        _account.logout();

        $timeout(function () {
          $location.path('/');
        }, 1000);
      });
    };
  }

}());