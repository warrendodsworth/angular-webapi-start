(function() {
  'use strict';
  //Modules
  angular.module('app', [
    'ngRoute',
    'controllers',
    'directives',
    'ui.bootstrap',
    'ngFacebook',
    'angular-toasty',
    'LocalStorageModule'
  ]);
  angular.module('controllers', ['services']);
  angular.module('directives', ['services']);
  angular.module('services', []);
  //Plugins
  angular.module('app').config([
    '$httpProvider',
    '$facebookProvider',
    function($httpProvider, $facebookProvider) {
      $httpProvider.interceptors.push('httpInterceptorService');
      $facebookProvider.setAppId('292179600807388').setPermissions('email,user_likes');
    }
  ]).config([
    'toastyConfigProvider',
    function(toastyConfigProvider) {
      toastyConfigProvider.setConfig({theme: 'material'});
    }
  ]).run([
    '$rootScope',
    'accountService',
    function($rootScope, accountService) {
      accountService.getIdentity();
      $rootScope.year = new Date().getFullYear();
      // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.
      // Load the facebook SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  ]);
}());
