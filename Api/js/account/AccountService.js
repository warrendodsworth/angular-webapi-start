(function () {
  'use strict';


  angular.module('app')
         .factory('AccountService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

           var service = {};

           //ACCOUNT

           service.identity = {
             isAuth: false,
             userName: ""
           };

           service.register = function (registration) {
             service.logOut();
             return $http.post('/api/account/register', registration);
           };

           service.login = function (model) {

             var data = "grant_type=password&username=" + model.userName + "&password=" + model.password;

             var deferred = $q.defer();

             $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {

               localStorageService.set('authorizationData', { token: res.data.access_token, userName: model.userName });
               service.identity.isAuth = true;
               service.identity.userName = model.userName;

               deferred.resolve(res);
             }, function (res) {
               service.logOut();
               deferred.reject(res);
             });

             return deferred.promise;
           };

           service.logOut = function () {
             localStorageService.remove('authorizationData');
             service.identity.isAuth = false;
             service.identity.userName = "";
           };

           service.getIdentity = function () {
             var authData = localStorageService.get('authorizationData');
             if (authData) {
               service.identity.isAuth = true;
               service.identity.userName = authData.userName;
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
                             + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/registerExternal.html')
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
         }]);
})();