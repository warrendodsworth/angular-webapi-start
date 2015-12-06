(function () {
    'use strict';

    angular
        .module('ctrls')
        .controller('RegisterExternalCtrl', RegisterExternalCtrl);

    RegisterExternalCtrl.$inject = ['$scope']; 

    function RegisterExternalCtrl($scope) {
        $scope.title = 'RegisterExternalCtrl';

        activate();

        function activate() { }
    }
})();
