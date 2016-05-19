(function () {
  'use strict';

  //Routes
  angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

        //Account
        $routeProvider.when('/login', { templateUrl: '/www/account/login.html', controller: 'LoginController' })
            .when('/register', { templateUrl: '/www/account/register.html', controller: 'RegisterController' })
            .when('/manage', { templateUrl: '/www/account/manage/manage.html', controller: 'ManageController' })
            .when('/manage/logins', { templateUrl: '/www/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

        //User
        $routeProvider
          .when('/notes', { templateUrl: '/www/user/notes/notes.html', controller: 'Notes.IndexController' })
          .when('/facebook', { templateUrl: '/www/user/facebook/facebook.html', controller: 'FacebookController' });

        $routeProvider
          .when('/', { templateUrl: '/www/home/index.html', controller: 'IndexController' })
          .otherwise({ redirectTo: '/' });

      }]);
})();