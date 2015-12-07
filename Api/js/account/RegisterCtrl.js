(function () {
  'use strict';

  angular
      .module('ctrls')
      .controller('RegisterCtrl', ['$scope', '$location', '$timeout', 'AccountService', RegisterCtrl]);

  function RegisterCtrl($scope, $location, $timeout, AccountService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.register = function (model) {

      AccountService.register(model).then(function (res) {
        $scope.savedSuccessfully = true;
        $scope.message = "User has been registered successfully,  you will be redicted to login page in 2 seconds.";

        $timeout(function () {
          $location.path('/login');
        }, 2000);

      },
       function (res) {
         var errors = [];
         for (var key in res.data.modelState) {
           for (var i = 0; i < res.data.modelState[key].length; i++) {
             errors.push(res.data.modelState[key][i]);
           }
         }
         $scope.message = "Failed to register user due to:" + errors.join(' ');
       });
    };
  }
})();
