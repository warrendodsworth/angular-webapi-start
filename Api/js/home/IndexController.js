(function () {
  'use strict';

  //Index
  angular.module('controllers')
         .controller('IndexController', ['$scope', IndexController]);

  function IndexController($scope) {

    $scope.create = function (model) {
      $scope.result = model.name;
    }
  }
})();