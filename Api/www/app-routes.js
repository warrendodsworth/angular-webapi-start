(function () {
  'use strict';

  //Routes
  angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {
        var root = '/www/';

        //Account
        $routeProvider.when('/login', { templateUrl: root+ 'account/login.html', controller: 'loginController' })
            .when('/register', { templateUrl: root + 'account/register.html', controller: 'registerController' })
            .when('/manage', { templateUrl: root + 'account/manage/manage.html', controller: 'manageController' })
            .when('/manage/logins', { templateUrl: root + 'account/manage/manageLogins.html', controller: 'manageLoginsController' });

        //User
        $routeProvider
          .when('/notes', { templateUrl: root + 'user/notes/notes.html', controller: 'notes.indexController' })
          .when('/facebook', { templateUrl: root + 'user/facebook/facebook.html', controller: 'facebookController' });

        $routeProvider
          .when('/', { templateUrl: root + 'home/index.html', controller: 'indexController' })
          .otherwise({ redirectTo: '/' });

      }]);
})();