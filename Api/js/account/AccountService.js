(function () {
  'use strict';


  angular.module('app')
         .factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

           var serviceBase = 'http://ngauthenticationapi.azurewebsites.net/';
           var authServiceFactory = {};

           service.identity = {
             isAuth: false,
             userName: ""
           };

           service.register = function (registration) {

             _logOut();

             return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
               return response;
             });
           };

           service.login = function (loginData) {

             var data = "grant_type=password&username=" +
             loginData.userName + "&password=" + loginData.password;

             var deferred = $q.defer();

             $http.post(serviceBase + 'token', data, {
               headers:
               { 'Content-Type': 'application/x-www-form-urlencoded' }
             }).success(function (response) {

               localStorageService.set('authorizationData',
               { token: response.access_token, userName: loginData.userName });

               service.identity.isAuth = true;
               service.identity.userName = loginData.userName;

               deferred.resolve(response);

             }).error(function (err, status) {
               _logOut();
               deferred.reject(err);
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
           }
       
           return service;
         }]);
})();