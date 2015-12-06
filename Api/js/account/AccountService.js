(function () {
  'use strict';


  angular.module('app')
         .factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

           var serviceBase = '/api/account/';
           var authServiceFactory = {};

           service.identity = {
             isAuth: false,
             userName: ""
           };

           service.register = function (registration) {
             service.logOut();
             return $http.post(serviceBase + 'api/account/register', registration);
           };

           service.login = function (model) {

             var data = "grant_type=password&username=" + model.userName + "&password=" + model.password;

             var deferred = $q.defer();

             $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {

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
           }

           return service;
         }]);
})();