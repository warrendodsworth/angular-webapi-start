(function () {
  'use strict';

  angular
      .module('ctrls')
      .controller('RegisterExternalCtrl', RegisterExternalController);

  RegisterExternalController.$inject = ['$http', '$scope', '$location', '$window', 'localStorageService', 'AccountService'];

  //Return from Facebook to this view, which should read #params and get the access token
  function RegisterExternalController($http, $scope, $location, $window, localStorageService, AccountService) {
    $scope.title = 'Social Login Confirm';
    $scope.model = {};

    //Callback / returnUrl from Facebook - get access_token
    var accessToken = $location.path().split(/[=&]+/)[1];
    console.log('Access token');
    console.log(accessToken);

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


        if (AccountService.identity.isAuth) {
          //Add login (user already registered)
          AccountService.addExternalLogin({ externalAccessToken: accessToken }).then(function (res) {
            $window.location.href = '/#/manage/logins?m=added';
          }, function (res) {
            $scope.res = res;
          });

        } else {
          //Log user in
          localStorageService.set('authorizationData', {
            token: accessToken
            //Get from an identity call - which happens on locatio.href change next
          });
          $window.location.href = '/#/';
        }
      }
    }, function (res) {
      $scope.res = res;
    })


    //Working
    //Next get local bearer token
    $scope.registerExternal = function (model) {
      AccountService.registerExternal(model, accessToken).then(function (res) {
        $scope.res = 'You\'ve registered successfully';
        console.log(res);

        //TODO Try using accessToken as a login for the user or Call ExternalLogin again and use that access token
      }, function (res) {
        $scope.res = res;
      });
    };
  }


  //Dont think its required
  angular
     .module('ctrls')
     .controller('ExternalLoginFailureCtrl', ExternalLoginFailureController);

  ExternalLoginFailureController.$inject = ['$scope'];

  function ExternalLoginFailureController($scope) {
    $scope.title = 'Social Login Failure';
  }
})();
