(function () {
  'use strict';
  angular.module('app').controller('FacebookController', FacebookController);
  FacebookController.$inject = [
    '$scope',
    '$http',
    '$facebook'
  ];
  function FacebookController($scope, $http, $facebook) {
    var vm = $scope;
    vm.connected = false;
    vm.title = 'Facebook';
    vm.eventId = '1622893741337148'; //test

    function activate() {
      $facebook.cachedApi('/me').then(function (res) {
        vm.user = res;

        $facebook.cachedApi('/' + vm.user.id + '/events').then(function (res) {
          vm.user.events = res;
        });
      });
    }

    vm.importEvent = function (eventId) {
      $facebook.api('/' + eventId).then(function (res) {
        vm.event = res;
      });
    };



    //login
    $facebook.getLoginStatus().then(login);

    function login(res) {
      if (res.status == 'connected') {
        vm.connected = true;
        activate();
        return;
      }

      $facebook.login().then(login);
    }
  }
}());


//var authData;
//authData = {
//  accessToken: res.authResponse.accessToken,
//  expiresIn: res.authResponse.expiresIn,
//  userId: res.authResponse.userID
//};