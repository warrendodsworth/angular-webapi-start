(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('ExternalLoginController', ExternalLoginController);

  ExternalLoginController.$inject = ['$http', '$scope', '$location', '$window', 'localStorageService', 'AccountService'];

  //Return from Facebook to this view, which should read #params and get the access token
  function ExternalLoginController($http, $scope, $location, $window, localStorageService, AccountService) {

    //Callback access_token
    var hash = $location.path().split(/[=&]+/);
    if (hash[0] == '/error') {
      $scope.action = 'error';
      return;
    }

    var accessToken = hash[1];
    var expiresIn = hash[3];
    var tokenType = hash[5];
    console.log('Access token');


    AccountService.getUserInfo(accessToken).then(function (res) {
      console.log('Get User Info');
      console.log(res.data);

      //1st time user - register local account
      $scope.loginProvider = res.data.loginProvider;
      $scope.model = {
        name: res.data.name,
        username: res.data.username,
        email: res.data.email
      };

      //2nd time user has local account
      if (res.data.hasRegistered) {
        $scope.action = 'process';

        if (AccountService.identity.auth) {
          //Add login (user already registered)
          AccountService.addExternalLogin({ externalAccessToken: accessToken }).then(function (res) {
            $window.location.href = '/#/manage/logins?m=added';
          }, function (res) {
            $scope.res = res;
          });

        } else {
          //Log user in
          localStorageService.set('authorizationData', {
            access_token: accessToken,
            token_type: tokenType,
            expires_in: expiresIn
          });
          $window.location.href = '/#/';
        }
      } else {
        $scope.action = 'register';
      }
    })


    $scope.registerExternal = function (model) {
      AccountService.registerExternal(model, accessToken).then(function (res) {
        $scope.res = 'You\'ve registered successfully';
        console.log(res);

        localStorageService.set('authorizationData', res.data );

        $window.location.href = '/#/';
      });
    };
  }

})();


//{
//  access_token: res.data.access_token,
//  token_type: res.data.token_type,
//  expires_in: res.data.expires_in
//}

//access_token: res.data.access_token,
//token_type: res.data.token_type,
//expires_in: res.data.expires_in,
//name: res.data.name,
//username: res.data.username