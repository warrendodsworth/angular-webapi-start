﻿(function () {
    'use strict';

    //Modules
    angular.module('app', ['ngRoute', 'ngSanitize',

                           'controllers',

                           'ngFacebook',
                           'LocalStorageModule']);

    angular.module('controllers', ['services']);

    angular.module('services', []);

    //Plugins
    angular
       .module('app')
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('AuthInterceptorService');
       }])
       .config(['$facebookProvider', function ($facebookProvider) {
           $facebookProvider.setAppId('292179600807388')
                            .setPermissions("email,user_likes");
       }])
       
      .run(['AccountService', function (AccountService) {
          AccountService.getIdentity();
      }])
      .run(function ($rootScope) {
          // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.

          // Load the facebook SDK asynchronously
          (function (d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) { return; }
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
      });


    //Routes
    angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

          //Home
          $routeProvider.when('/', { templateUrl: '/home/index.html', controller: 'IndexController' });

          //Account
          $routeProvider.when('/login', { templateUrl: '/account/login.html', controller: 'LoginController' })
                        .when('/register', { templateUrl: '/account/register.html', controller: 'RegisterController' })
                        .when('/manage', { templateUrl: '/account/manage/manage.html', controller: 'ManageController' })
                        .when('/manage/logins', { templateUrl: '/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

          //User
          $routeProvider.when('/notes/create', { templateUrl: '/user/notes/create.html', controller: 'Notes.CreateController' });

          $routeProvider.when('/facebook', { templateUrl: '/user/facebook.html', controller: 'FacebookController' });


          $routeProvider.otherwise({ redirectTo: '/' });

      }]);

})();