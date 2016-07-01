(function () {
  'use strict';

  angular.module('controllers').controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$http', '$location'];

  function IndexController($scope, $http, $location) {
    var vm = $scope;

    $http.get('/api/posts').then(function (res) {
      vm.posts = res.data.items;
      vm.total = res.data.total;
    });
  }
}());