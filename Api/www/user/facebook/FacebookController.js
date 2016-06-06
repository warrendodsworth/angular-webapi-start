(function () {
  'use strict';
  angular.module('app').controller('facebookController', facebookController);
  facebookController.$inject = [
    '$scope',
    '$http',
    '$facebook'
  ];
  function facebookController($scope, $http, $facebook) {
    $scope.title = 'Facebook';
    var authData, connected;
    $facebook.getLoginStatus().then(function (res) {
      if (res.status === 'connected') {
      }
      $facebook.login().then(function (res) {
        if (res.status === 'connected') {
          connected = true;
          authData = {
            accessToken: res.authResponse.accessToken,
            expiresIn: res.authResponse.expiresIn,
            userId: res.authResponse.userID
          };
          load();
        }
      });
    });
    function load() {
      $facebook.api('/me').then(function (res) {
        $scope.user = res;
      });
      $facebook.api('/' + authData.userId + '/photos').then(function (res) {
        console.log(res);
      });
    }
  }
}());