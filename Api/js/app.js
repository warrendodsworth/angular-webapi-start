(function () {
  'use strict';

  //Modules
  angular.module('app', ['ngRoute',

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

      $routeProvider.when('/create', { templateUrl: '/js/home/create.html', controller: 'CreateController' })
                    .when('/', { templateUrl: '/js/home/index.html', controller: 'IndexController' });

      $routeProvider.when('/login', { templateUrl: '/js/account/login.html', controller: 'LoginController' })
                    .when('/register', { templateUrl: '/js/account/register.html', controller: 'RegisterController' });

      $routeProvider.otherwise({ redirectTo: '/' });

    }]);

})();