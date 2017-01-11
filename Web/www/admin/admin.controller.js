(function () {
  'use strict';

  angular
    .module('app')
    .controller('AdminController', ['$scope', AdminController]);

  function AdminController($scope) {
    var vm = $scope;

    vm.title = '';

    activate();

    function activate() {
       
    }
  }
})();
