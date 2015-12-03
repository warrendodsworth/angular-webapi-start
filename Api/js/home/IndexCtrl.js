(function () {
  'use strict';

  //Index
  angular.module('ctrls').controller('IndexCtrl', ['$scope', IndexCtrl]);

  function IndexCtrl($scope) {

    $scope.create = function (model) {
      $scope.result = model.name;
    }
  }


  //Create
  angular.module('ctrls').controller('CreateCtrl', ['$scope', CreateCtrl]);

  function CreateCtrl($scope) {

  }

})();