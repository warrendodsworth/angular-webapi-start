(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('LoginController', ['$scope', '$location', 'AccountService', LoginController]);

    function LoginController($scope, $location, AccountService) {

        AccountService.getExternalLogins().then(function (res) {
            $scope.logins = res.data;
        });


        $scope.login = function (model) {
            AccountService.login(model).then(function (res) {
                $location.path('/').search('m', 'welcome');
            },
             function (res) {
                 $scope.res = res;
             });
        };

    }

})();
