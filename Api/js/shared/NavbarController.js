(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('NavbarController', ['$scope', '$location', 'AccountService', NavbarController]);

    function NavbarController($scope, $location, AccountService) {

        $scope.identity = AccountService.identity;

        $scope.$on('user:logout', function (event, data) {
            $scope.identity = data;
        });

        $scope.logout = function () {
            AccountService.logout();
            $location.path('/');
        }
    }
})();