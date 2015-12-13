(function () {
  'use strict';

  angular
      .module('app')
      .controller('FacebookController', FacebookController);

  FacebookController.$inject = ['$scope', '$http', 'FacebookService'];

  function FacebookController($scope, $http, FacebookService) {
    $scope.title = 'FacebookController';

    //FacebookService.api('/me', { fields: 'last_name' }).then(function (res) {
    //  $scope.result = res;
    //})

  }
})();
