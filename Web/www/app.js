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
    'ngFacebook',
    'angular-promise-cache',
    'controllers',
    'services'
  ])
  .constant('config', {
    userPopover: './www/shared/tpl/userpopover.html'
  })
  .config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('_httpInterceptorService');
    }
  ])
  .config(['toastyConfigProvider', function (toastyConfigProvider) {
    toastyConfigProvider.setConfig({
      sound: false,
      shake: false,
      theme: 'material'
    });
  }])
  .run([
    '$rootScope',
    '_account',
    function ($rootScope, _account) {
      _account.getIdentity();

      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
      });
    }
  ])
  .config(function ($facebookProvider) {
    $facebookProvider.setAppId('292179600807388');
    $facebookProvider.setPermissions("email,user_likes,user_events");
  })
  .run(function ($rootScope) {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });

  //TODO restructure modules by component
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
