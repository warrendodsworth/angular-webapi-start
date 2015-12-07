(function () {
  'use strict';

  //Modules
  angular.module('app', ['ngRoute',

                         'ctrls',

                         'LocalStorageModule']);

  angular.module('ctrls', []);


  //Routes
  angular.module('app')
         .config(['$routeProvider', function ($routeProvider) {

           $routeProvider.when('/create', { templateUrl: '/js/home/create.html', controller: 'CreateCtrl' })
                         .when('/', { templateUrl: '/js/home/index.html', controller: 'IndexCtrl' });

           $routeProvider.when('/login', { templateUrl: '/js/account/login.html', controller: 'LoginCtrl' })
                         .when('/register', { templateUrl: '/js/account/register.html', controller: 'RegisterCtrl' });

           $routeProvider.otherwise({ redirectTo: '/' });

         }]);

  //Plugins
  angular.module('app')
         .config(function ($httpProvider) {
           $httpProvider.interceptors.push('AuthInterceptorService');
         });

})();