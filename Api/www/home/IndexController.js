(function() {
  'use strict';
  //Index
  angular.module('controllers').controller('indexController', indexController);
  indexController.$inject = [
    '$scope',
    '$http',
    '$location'
  ];
  function indexController($scope, $http, $location) {
    var vm = $scope;
    $http.get('/api/notes').then(function(res) {
      vm.notes = res.data.items;
      vm.total = res.data.total;
    });
  }
}());
