(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('User.NotesController', Controller);

    Controller.$inject = ['$scope', '$http', '$location', 'AccountService'];

    function Controller($scope, $http, $location, AccountService) {
        $scope.title = 'Notes';

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
