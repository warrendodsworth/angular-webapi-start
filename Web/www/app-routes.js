(function () {
  'use strict';

  angular
    .module('app')
    .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      var root = '/www/';
      $locationProvider.hashPrefix('');
      $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
      });

      //Account
      $routeProvider
        .when('/login', { title: 'Login', controller: 'LoginController', templateUrl: root + 'account/login.html' })
        .when('/register', { title: 'Register', controller: 'RegisterController', templateUrl: root + 'account/register.html' })
        .when('/manage', { title: 'Manage', controller: 'manageController', templateUrl: root + 'account/manage.html' })
        .when('/maange/edit', { title: 'Edit', controller: 'EditController', templateUrl: root + 'account/edit.html' })
        .when('/manage/logins', { title: 'Social Logins', controller: 'manageLoginsController', templateUrl: root + 'account/manageLogins.html' })

      //User
        .when('/posts', { title: 'Posts', controller: 'posts.IndexController', templateUrl: root + 'user/posts.html' })
        .when('/facebook', { title: 'Facebook', controller: 'FacebookController', templateUrl: root + 'user/facebook.html' })

      //Admin
        .when('/a', { title: 'Admin', controller: 'AdminController', templateUrl: root + 'admin/admin.html' })
        .when('/', { title: 'Home', controller: 'IndexController', templateUrl: root + 'home/index.html' })
        .otherwise({ redirectTo: '/' });
    }]);
}());