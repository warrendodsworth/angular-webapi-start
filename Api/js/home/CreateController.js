(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('CreateController', CreateController);

    CreateController.$inject = ['$scope', '$http', '$location'];

    function CreateController($scope, $http, $location) {
        $scope.title = 'Create Controller';

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
