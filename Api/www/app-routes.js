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
        .when('/manage', { templateUrl: root + 'account/manage.html', controller: 'manageController' })
        .when('/maange/edit', { templateUrl: root + 'account/edit.html', controller: 'EditController' })
        .when('/manage/logins', { templateUrl: root + 'account/manageLogins.html', controller: 'manageLoginsController' });
      //User
      $routeProvider
        .when('/posts', { templateUrl: root + 'user/posts/posts.html', controller: 'posts.IndexController' })
        .when('/facebook', { templateUrl: root + 'user/facebook/facebook.html', controller: 'FacebookController' })

      //Admin
        .when('/a', { templateUrl: root + 'admin/admin.html', controller: 'AdminController' })

        .when('/', { templateUrl: root + 'home/index.html', controller: 'IndexController' })
        .otherwise({ redirectTo: '/' });
    }]);
}());