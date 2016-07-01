(function () {
  'use-strict';

  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'angular-toasty',
    'ui.bootstrap',
    'LocalStorageModule',
    'controllers',
    'services'
  ]).run([
    '$rootScope',
    'accountService',
    function ($rootScope, AccountService) {
      AccountService.getIdentity();
    }
  ]).config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptorService');
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
