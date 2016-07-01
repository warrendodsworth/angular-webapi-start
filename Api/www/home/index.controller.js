(function () {
  'use strict';

  angular.module('controllers').controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$http', '$location'];

  function IndexController($scope, $http, $location) {
    var vm = $scope;

    $http.get('/api/notes').then(function (res) {
      vm.notes = res.data.items;
      vm.total = res.data.total;
    });
  }
}());