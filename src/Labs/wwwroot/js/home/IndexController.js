(function () {
    'use strict';

    //Index
    angular.module('controllers')
           .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', '$http', '$location'];

    function IndexController($scope, $http, $location) {

        $http.get('/api/notes').then(function (res) {
            $scope.notes = res.data;
        });

    }
})();