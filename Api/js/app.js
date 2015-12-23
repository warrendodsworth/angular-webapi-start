(function () {
    'use strict';

    //Modules
    angular.module('app', ['ngRoute', 'ngSanitize',

                           'controllers',

                           'LocalStorageModule']);

    angular.module('controllers', ['services']);

    angular.module('services', []);


    //Plugins
    angular
       .module('app')
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('AuthInterceptorService');
       }]);

    angular
      .module('app')
      .run(['AccountService', function (AccountService) {
          AccountService.getIdentity();
      }]);


    //Routes
    angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

          //Home
          $routeProvider.when('/', { templateUrl: '/js/home/index.html', controller: 'IndexController' });

          //Account
          $routeProvider.when('/login', { templateUrl: '/js/account/login.html', controller: 'LoginController' })
                        .when('/register', { templateUrl: '/js/account/register.html', controller: 'RegisterController' })
                        .when('/manage', { templateUrl: '/js/account/manage/manage.html', controller: 'ManageController' })
                        .when('/manage/logins', { templateUrl: '/js/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

          //User
          $routeProvider.when('/notes/create', { templateUrl: '/js/user/notes/create.html', controller: 'Notes.CreateController' });

          $routeProvider.when('/facebook', { templateUrl: '/js/user/facebook.html', controller: 'FacebookController' });


          $routeProvider.otherwise({ redirectTo: '/' });

      }]);

})();