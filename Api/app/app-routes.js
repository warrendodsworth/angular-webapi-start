(function () {
  'use strict';

  //Routes
  angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

        //Account
        $routeProvider.when('/login', { templateUrl: '/app/account/login.html', controller: 'LoginController' })
            .when('/register', { templateUrl: '/app/account/register.html', controller: 'RegisterController' })
            .when('/manage', { templateUrl: '/app/account/manage/manage.html', controller: 'ManageController' })
            .when('/manage/logins', { templateUrl: '/app/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

        //User
        $routeProvider
          .when('/notes', { templateUrl: '/app/user/notes/notes.html', controller: 'Notes.IndexController' })
          .when('/notes/create', { templateUrl: '/app/user/notes/create.html', controller: 'Notes.CreateController' });

        $routeProvider
          .when('/facebook', { templateUrl: '/app/user/facebook/facebook.html', controller: 'FacebookController' });

        $routeProvider
          .when('/', { templateUrl: '/app/home/index.html', controller: 'IndexController' })
          .otherwise({ redirectTo: '/' });

      }]);
})();