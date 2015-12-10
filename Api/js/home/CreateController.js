(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateController', CreateController);

    CreateController.$inject = ['$scope']; 

    function CreateController($scope) {
        $scope.title = 'CreateController';

        activate();

        function activate() { }
    }
})();
