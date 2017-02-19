(function () {
  'use strict';

  angular
    .module('app')
    .controller('EditController', ['$scope', '$location', '_account', '_notify', EditController]);

  function EditController($scope, $location, _account, _notify) {
    var vm = $scope;
    vm.title = '';

    _account.getCurrentUser().then(function (res) {
      vm.user = res.data;
    });

    vm.save = function (model) {
      _account.putCurrentUser(model).then(function (res) {
        _notify.success('Saved');
        $location.path('/manage');
      });
    };

    // upload later on form submit or something similar
    vm.submit = function () {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
      Upload.upload({
        url: 'api/photos',
        data: { file: file, 'username': $scope.username }
      }).then(function (res) {
        _notify.success('Success ' + resp.config.data.file.name + 'uploaded');
        console.log(res.data);
      }, function (res) {
        console.log(res);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        _notify.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    //$scope.uploadFiles = function (files) {
    //  Upload.upload({url:'', data: {file: files});
    //}
  }
})();
