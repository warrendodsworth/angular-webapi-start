(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('NavbarController', ['$scope', '$location', 'AccountService', NavbarController]);

    function NavbarController($scope, $location, AccountService) {

        $scope.identity = AccountService.identity;

        $scope.logout = function () {
            AccountService.logout();
            $location.path('/');
        }
    }
})();


//$scope.$on('user:logout', function (event, data) {
//    $scope.identity = data;
//});