(function () {
  'use strict';

  angular.module('services').factory('_account', accountService);

  accountService.$inject = ['$q', '$http', '$rootScope', 'localStorageService'];

  function accountService($q, $http, $rootScope, localStorageService) {
    var svc = {};

    $rootScope.identity = svc.identity = {
      auth: false
    };

    svc.login = function (model) {
      var data = 'grant_type=password&username=' + model.username + '&password=' + model.password;

      return $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(function (res) {
          localStorageService.set('authorizationData', res.data);

          svc.identity.auth = true;
          svc.identity.username = res.data.username;
          svc.identity.name = res.data.name;
          return res;
        }, function (res) {
          svc.logout();
          return res;
        });
    };
    svc.logout = function () {
      localStorageService.remove('authorizationData');
      svc.identity.auth = false;
      svc.identity.username = '';
      svc.identity.name = '';
    };
    svc.register = function (model) {
      svc.logout();
      return $http.post('/api/account/register', model);
    };
    svc.getIdentity = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        svc.identity.auth = true;
        svc.identity.username = authData.username;
        svc.identity.name = authData.name;
      }
    };
    svc.deactivateAccount = function () {
      return $http.put('/api/account/deactivate');
    };
    svc.getMe = function () {
      return $http.get('/api/account/me');
    };
    svc.putMe = function (userBindingModel) {
      return $http.put('/api/account/me', userBindingModel);
    };


    //EXTERNAL LOGINS
    svc.getUserInfo = function (accessToken) {
      var config = accessToken ? { headers: { Authorization: 'Bearer ' + accessToken } } : {};
      return $http.get('/api/account/user-info', config);
    };
    svc.getExternalLogins = function (returnUrl, generateState) {
      return $http.get('/api/account/external-logins' + '?returnUrl=' + encodeURIComponent(returnUrl || '/www/account/externalLogin.html') + '&generateState=' + (generateState || false));
    };
    svc.getManageLogins = function () {
      return $http.get('/api/account/manage-info' + '?returnUrl=' + encodeURIComponent('/www/account/externalLogin.html'));
    };
    //{ email }
    svc.registerExternal = function (model, externalAccessToken) {
      var config = externalAccessToken ? { headers: { Authorization: 'Bearer ' + externalAccessToken } } : {};
      return $http.post('/api/account/register-external', model, config);
    };
    //{ externalAccessToken }
    svc.addExternalLogin = function (model) {
      return $http.post('/api/account/add-external-login', model);
    };
    //{ loginProvider, providerKey }
    svc.removeLogin = function (model) {
      return $http.post('/api/account/remove-login', model);
    };
   
    //MANAGE
    svc.forgotPassword = function (model) {
      return $http.post('/api/account/forgot-password', model);
    };
    svc.changePassword = function (model) {
      return $http.post('/api/account/change-password', model);
    };
    svc.setPassword = function (model) {
      return $http.post('/api/account/set-password', model);
    };

    return svc;
  }
}());


//$rootScope.$broadcast('user:logout', svc.identity);
//Only required if you overwrite an entire svc object, modifying the individual properties removes the need for broadcast
