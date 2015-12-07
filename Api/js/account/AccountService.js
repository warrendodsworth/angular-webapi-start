(function () {
  'use strict';

  angular
    .module('app')
    .factory('AccountService', ['$http', '$q', 'localStorageService', AccountService]);
  
  function AccountService($http, $q, localStorageService) {

    var service = {};

    //ACCOUNT

    service.identity = {
      isAuth: false,
      username: ''
    };

    service.register = function (model) {
      service.logOut();
      return $http.post('/api/account/register', model);
    };

    service.login = function (model) {

      var data = "grant_type=password&username=" + model.username + "&password=" + model.password;

      var deferred = $q.defer();

      $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {

        localStorageService.set('authorizationData', { token: res.data.access_token, username: model.username });
        service.identity.isAuth = true;
        service.identity.username = model.username;

        deferred.resolve(res);
      }, function (res) {
        service.logOut();
        deferred.reject(res);
      });

      return deferred.promise;
    };

    service.logout = function () {
      localStorageService.remove('authorizationData');
      service.identity.isAuth = false;
      service.identity.username = '';
    };

    service.getIdentity = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        service.identity.isAuth = true;
        service.identity.username = authData.username;
      }
    };

    //EXTERNAL LOGINS

    //Get User Info
    service.getUserInfo = function (accessToken) {
      var config = accessToken ? { headers: { 'Authorization': 'Bearer ' + accessToken } } : {};
      return $http.get('/api/account/UserInfo', config);
    }

    //Get External Logins
    service.getExternalLogins = function (returnUrl, generateState) {
      return $http.get('/api/account/externalLogins'
                      + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html')
                      + '&generateState=' + (generateState || false));
    };

    //Register External Login { email }
    service.registerExternal = function (model, externalAccessToken) {
      return $http.post('/api/account/registerExternal', model, {
        headers: { 'Authorization': 'Bearer ' + externalAccessToken }
      });
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
      return $http.get('/api/account/manageInfo'
                      + '?returnUrl=' + encodeURIComponent(returnUrl || '/'));
    };

    return service;
  }

})();