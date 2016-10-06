(function () {
  'use strict';

  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'angular-toasty',
    'ui.bootstrap',
    'LocalStorageModule',
    'ngFileUpload',
    'ngImgCrop',
    'controllers',
    'services'
  ]).run([
    '$rootScope',
    'AccountService',
    function ($rootScope, AccountService) {
      AccountService.getIdentity();

      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
      });
    }
  ]).config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptorService');
    }
  ])

  .config(['toastyConfigProvider', function (toastyConfigProvider) {
    toastyConfigProvider.setConfig({
      sound: false,
      shake: false,
      theme: 'material'
    });
  }]);

  angular.module('controllers', ['services']);
  angular.module('services', []);

}());


//var config = {
//  apiKey: 'AIzaSyC9xO8omc7TxZZ0n4SOQW3bpE-uRryaVD4',
//  authDomain: 'dazzling-fire-5094.firebaseapp.com',
//  databaseURL: 'https://dazzling-fire-5094.firebaseio.com/',
//  storageBucket: 'gs://dazzling-fire-5094.appspot.com'
//};
//firebase.initializeApp(config);
