(function () {
  'use strict';

  angular
      .module('app')
      .controller('ExternalLoginController', ExternalLoginController);

  ExternalLoginController.$inject = ['$http', '$scope', '$location', '$window', 'localStorageService', '_account'];

  //Return from Facebook to this view, which should read #params and get the access token
  function ExternalLoginController($http, $scope, $location, $window, localStorageService, _account) {
    var vm = $scope;

    //Callback access_token
    var hash = $location.path().split(/[=&]+/);
    if (hash[0] == '/error') {
      vm.action = 'error';
      return;
    }

    var accessToken = hash[1];
    var expiresIn = hash[3];
    var tokenType = hash[5];
    console.log('Access token');


    _account.getUserInfo(accessToken).then(function (res) {
      console.log('Get User Info');
      console.log(res.data);

      //1st time user - register local account
      vm.loginProvider = res.data.loginProvider;
      vm.model = {
        name: res.data.name,
        username: res.data.username,
        email: res.data.email
      };

      //2nd time user has local account
      if (res.data.hasRegistered) {
        vm.action = 'process';

        if (_account.identity.isAuth) {
          //Add login (user already registered)
          _account.addExternalLogin({ externalAccessToken: accessToken }).then(function (res) {
            $window.location.href = '/#/manage/logins?m=added';
          }, function (res) {
            vm.res = res;
          });

        } else {
          //Log user in
          localStorageService.set('authorizationData', {
            token: accessToken,
            tokenType: tokenType,
            expiresIn: expiresIn
          });
          $window.location.href = '/#/';
        }
      } else {
        vm.action = 'register';
      }
    }, function (res) {
      vm.res = res;
    });


    vm.registerExternal = function (model) {
      _account.registerExternal(model, accessToken).then(function (res) {
        vm.res = 'You\'ve registered successfully';
        console.log(res);

        localStorageService.set('authorizationData', {
          token: res.data.access_token,
          tokenType: res.data.token_type,
          expiresIn: res.data.expires_in
        });

        $window.location.href = '/#/';
      }, function (res) {
        vm.res = res;
      });
    };
  }

})();