(function () {
  'use strict';

  //Modules
  angular.module('app', ['ngRoute', 'ngSanitize',

                         'controllers',

                         'LocalStorageModule']);

  angular.module('controllers', []);


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

      $routeProvider.when('/', { templateUrl: '/js/home/index.html', controller: 'IndexController' })
                    .when('/create', { templateUrl: '/js/home/create.html', controller: 'CreateController' });

      $routeProvider.when('/login', { templateUrl: '/js/account/login.html', controller: 'LoginController' })
                    .when('/register', { templateUrl: '/js/account/register.html', controller: 'RegisterController' })
                    .when('/manage/logins', { templateUrl: '/js/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

      $routeProvider.when('/facebook', { templateUrl: '/js/user/facebook.html', controller: 'FacebookController' });


      $routeProvider.otherwise({ redirectTo: '/' });

    }]);

})();