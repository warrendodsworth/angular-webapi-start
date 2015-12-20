(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('NavbarController', ['$scope', 'AccountService', NavbarController]);

    function NavbarController($scope, AccountService) {

        $scope.identity = AccountService.identity;

        $scope.$on('user:logout', function (event, data) {
            $scope.identity = data;
            console.log('Logout broadcast detected');
        });

        $scope.logout = function () {
            AccountService.logout();
        }
    }
})();