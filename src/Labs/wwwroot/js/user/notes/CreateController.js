(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('Notes.CreateController', CreateController);

    CreateController.$inject = ['$scope', '$http', '$location', 'AccountService'];

    function CreateController($scope, $http, $location, AccountService) {
        $scope.title = 'Create Controller';

        if (!AccountService.identity.isAuth) {
            $location.path('/login').search('m', '401');
        }

        $scope.create = function (model) {

            $http.post('/api/notes', model).then(function (res) {
                $scope.res = 'Note Created';
                $location.path('/');
            }, function (res) {
                $scope.res = res;
            });

        };

    }
})();
