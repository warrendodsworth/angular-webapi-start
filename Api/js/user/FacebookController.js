(function () {
  'use strict';

  angular
      .module('app')
      .controller('FacebookController', FacebookController);

  FacebookController.$inject = ['$scope', '$http', '$facebook'];

  function FacebookController($scope, $http, $facebook) {
    $scope.title = 'FacebookController';

    var authData, connected;

    $facebook.getLoginStatus().then(function (res) {
      if (res.status != 'connected') {
        $facebook.login().then(function (res) {
          if (res.status == 'connected') {
            connected = true;
            authData = {
              accessToken: res.authResponse.accessToken,
              expiresIn: res.authResponse.expiresIn,
              userId: res.authResponse.userID
            };
          }
        });
      }
    });


    //$facebook.api('/me', { fields: 'last_name' }).then(function (res) {
    //  $scope.result = res;
    //});

    $facebook.api('/me').then(function (res) {
      $scope.user = res;
    });

  }
})();
