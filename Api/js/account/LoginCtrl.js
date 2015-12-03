(function () {
  'use strict';

  angular
      .module('app')
      .controller('LoginCtrl', ['$scope', '$location', 'AccountService', function ($scope, $location, AccountService) {

        $scope.message = "";

        $scope.login = function (model) {
          AccountService.login(model).then(function (res) {
            $location.path('/create');
          },
           function (res) {
             $scope.message = res.error_description;
           });
        };

      }]);
})();
