(function () {
  'use strict';
  angular.module('controllers').controller('manageController', manageController);
  manageController.$inject = [
    '$scope',
    '$location',
    '$timeout',
    'Upload',
    'AccountService',
    'NotifyService'
  ];
  function manageController($scope, $location, $timeout, Upload, AccountService, NotifyService) {
    AccountService.getCurrentUser().then(function (res) {
      $scope.user = res.data;
    });

    $scope.deactivate = function () {
      AccountService.deactivateAccount().then(function (res) {
        $scope.res = 'Account Deactivated';
        AccountService.logout();
        $timeout(function () {
          $location.path('/');
        }, 2000);
      });
    };

    // upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
      Upload.upload({
        url: 'api/photos',
        data: {file: file, 'username': $scope.username}
      }).then(function (res) {
        Notify.success('Success ' + resp.config.data.file.name + 'uploaded');
        console.log(res.data);
      }, function (res) {
        console.log(res);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        NotifyService.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    //$scope.uploadFiles = function (files) {
    //  Upload.upload({url:'', data: {file: files});
    //}
  }

}());