(function () {
  'use strict';

  //Index
  angular.module('ctrls')
         .controller('IndexCtrl', ['$scope', IndexController]);

  function IndexController($scope) {

    $scope.create = function (model) {
      $scope.result = model.name;
    }
  }


  //Create
  angular.module('ctrls')
         .controller('CreateCtrl', ['$scope', CreateController]);

  function CreateController($scope) {

  }

})();