(function () {
  'use strict';

  angular
      .module('app')
      .controller('FacebookController', FacebookController);

  FacebookController.$inject = ['$scope', 'FacebookService'];

  function FacebookController($scope, FacebookService) {
    $scope.title = 'FacebookController';

    activate();

    function activate() {

      FacebookService.api('/me', { fields: 'last_name' }).then(function (res) {
        $scope.result = res;
      })

    }
  }
})();
