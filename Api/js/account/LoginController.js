(function () {
  'use strict';

  angular
      .module('app')
      .controller('LoginController', ['$scope', '$location', 'AccountService', LoginController]);

  function LoginController($scope, $location, AccountService) {

    AccountService.getExternalLogins().then(function (res) {
      $scope.logins = res.data;
    });


    $scope.message = "";

    $scope.login = function (model) {
      AccountService.login(model).then(function (res) {
        $location.path('/').search('m', 'welcome');
      },
       function (res) {
         $scope.message = res.error_description;
       });
    };

  }

})();
