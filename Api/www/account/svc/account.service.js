(function () {
  'use strict';
  angular.module('services').factory('AccountService', AccountService);
  AccountService.$inject = [
    '$q',
    '$http',
    '$rootScope',
    'localStorageService'
  ];
  function AccountService($q, $http, $rootScope, localStorageService) {
    var service = {};

    $rootScope.identity = service.identity = {
      auth: false,
      username: ''
    };

    //Register
    service.register = function (model) {
      service.logout();
      return $http.post('/api/account/register', model);
    };

    //Login
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

    //Logout
    service.logout = function () {
      localStorageService.remove('authorizationData');
      service.identity.auth = false;
      service.identity.username = '';
      service.identity.name = '';  //$rootScope.$broadcast('user:logout', service.identity);
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

    //EXTERNAL LOGINS
    //Get User Info
    service.getUserInfo = function (accessToken) {
      var config = accessToken ? { headers: { Authorization: 'Bearer ' + accessToken } } : {};
      return $http.get('/api/account/UserInfo', config);
    };
    //Get External Logins
    service.getExternalLogins = function (returnUrl, generateState) {
      return $http.get('/api/account/externalLogins' + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html') + '&generateState=' + (generateState || false));
    };
    //Register External Login { email }
    service.registerExternal = function (model, externalAccessToken) {
      var config = externalAccessToken ? { headers: { Authorization: 'Bearer ' + externalAccessToken } } : {};
      return $http.post('/api/account/registerExternal', model, config);
    };
    //Add External Login { externalAccessToken }
    service.addExternalLogin = function (model) {
      return $http.post('/api/account/addExternalLogin', model);
    };
    //Remove Login { loginProvider, providerKey }
    service.removeLogin = function (model) {
      return $http.post('/api/account/removeLogin', model);
    };
    //Manage social logins
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