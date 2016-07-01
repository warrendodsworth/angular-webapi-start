(function () {
  'use strict';
  
  angular.module('app').config([
    '$routeProvider',
    function ($routeProvider) {
      var root = '/www/';

      //Account
      $routeProvider
        .when('/login', { templateUrl: root + 'account/login.html', controller: 'LoginController' })
        .when('/register', { templateUrl: root + 'account/register.html', controller: 'RegisterController' })
        .when('/manage', { templateUrl: root + 'account/manage/manage.html', controller: 'manageController' })
        .when('/manage/logins', { templateUrl: root + 'account/manage/manageLogins.html', controller: 'manageLoginsController' });
      //User
      $routeProvider
        .when('/notes', { templateUrl: root + 'user/notes/notes.html', controller: 'notes.IndexController' })
        .when('/facebook', { templateUrl: root + 'user/facebook/facebook.html', controller: 'FacebookController' })

        .when('/', { templateUrl: root + 'home/index.html', controller: 'IndexController' })
        .otherwise({ redirectTo: '/' });
    }]);
}());