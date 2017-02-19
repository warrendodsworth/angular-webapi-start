(function () {
  'use strict';

  angular.module('services').factory('_account', accountService);

  accountService.$inject = ['$q', '$http', '$rootScope', 'localStorageService'];

  function accountService($q, $http, $rootScope, localStorageService) {
    var service = {};

    $rootScope.identity = service.identity = {
      auth: false
    };

    service.register = function (model) {
      service.logout();
      return $http.post('/api/account/register', model);
    };

    service.login = function (model) {
      var data = 'grant_type=password&username=' + model.username + '&password=' + model.password;
      var deferred = $q.defer();

      $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {
        localStorageService.set('authorizationData', res.data);

        service.identity.auth = true;
        service.identity.username = res.data.username;
        service.identity.name = res.data.name;
        deferred.resolve(res);
      }, function (res) {
        service.logout();
        deferred.reject(res);
      });
      return deferred.promise;
    };

    service.logout = function () {
      localStorageService.remove('authorizationData');
      service.identity.auth = false;
      service.identity.username = '';
      service.identity.name = '';
      //$rootScope.$broadcast('user:logout', service.identity);
      //Only required if you overwrite an entire service object, modifying the individual properties removes the need for broadcast
    };
    service.getIdentity = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        service.identity.auth = true;
        service.identity.username = authData.username;
        service.identity.name = authData.name;
      }
    };
    service.deactivateAccount = function () {
      return $http.put('/api/account/deactivate');
    };
    service.getCurrentUser = function () {
      return $http.get('/api/account/me');
    };

    service.putCurrentUser = function (userBindingModel) {
      return $http.put('/api/account/me', userBindingModel);
    };


    //EXTERNAL LOGINS
    service.getUserInfo = function (accessToken) {
      var config = accessToken ? { headers: { Authorization: 'Bearer ' + accessToken } } : {};
      return $http.get('/api/account/UserInfo', config);
    };

    service.getExternalLogins = function (returnUrl, generateState) {
      return $http.get('/api/account/externalLogins' + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html') + '&generateState=' + (generateState || false));
    };
    //model > { email }
    service.registerExternal = function (model, externalAccessToken) {
      var config = externalAccessToken ? { headers: { Authorization: 'Bearer ' + externalAccessToken } } : {};
      return $http.post('/api/account/registerExternal', model, config);
    };
    //model > { externalAccessToken }
    service.addExternalLogin = function (model) {
      return $http.post('/api/account/addExternalLogin', model);
    };
    //model > { loginProvider, providerKey }
    service.removeLogin = function (model) {
      return $http.post('/api/account/removeLogin', model);
    };

    service.getManageLogins = function (returnUrl) {
      return $http.get('/api/account/manageInfo' + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html'));
    };

    //MANAGE
    service.forgotPassword = function (model) {
      return $http.post('/api/account/forgotPassword', model);
    };
    return service;
  }
}());