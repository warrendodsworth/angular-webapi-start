(function () {
  'use strict';

  angular
    .module('app')
    .controller('EditController', EditController);

  EditController.$inject = ['$scope', '$location', '_account', '_autocomplete', '_notify', 'Upload'];

  function EditController($scope, $location, _account, _autocomplete, _notify, Upload) {
    var vm = $scope;
    vm.title = '';
    vm.getAddressHint = _autocomplete.getAddressHint;

    _account.getCurrentUser().then(function (res) {
      vm.user = res.data;
    });

    vm.save = function (model) {
      _account.putCurrentUser(model).then(function (res) {
        _notify.success('Saved');
        $location.path('/manage');
      });
    };

    vm.submit = function () {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    vm.upload = function (file) {
      if (file == null) {
        _notify.info('File not valid');
        return;
      }

      Upload.upload({
        url: 'api/photos',
        data: { file: file, 'username': $scope.username }
      }).then(function (res) {
        console.log(res);
        _notify.success('Success ' + res.data.name + ' uploaded');
      }, function (res) {
        _notify.error(res);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        _notify.info('progress: ' + progressPercentage + '%');
      });
    };
  }

})();
