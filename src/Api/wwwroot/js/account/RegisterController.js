(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function RegisterController($scope, $location, $timeout, AccountService) {

        $scope.register = function (model) {
            AccountService.register(model).then(function (res) {
                $scope.res = "Account created.";

                $timeout(function () {
                    $location.path('/login');
                }, 2000);

            }, function (res) { $scope.res = res; });
        };
    }
})();
