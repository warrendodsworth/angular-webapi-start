(function () {
  'use strict';

  //Routes
  angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

        //Account
        $routeProvider.when('/login', { templateUrl: 'account/login.html', controller: 'LoginController' })
            .when('/register', { templateUrl: 'account/register.html', controller: 'RegisterController' })
            .when('/manage', { templateUrl: 'account/manage/manage.html', controller: 'ManageController' })
            .when('/manage/logins', { templateUrl: 'account/manage/manageLogins.html', controller: 'ManageLoginsController' });

        //User
        $routeProvider
          .when('/notes', { templateUrl: 'user/notes/notes.html', controller: 'User.NotesController' })
       
          .when('/facebook', { templateUrl: 'user/facebook.html', controller: 'FacebookController' });

        $routeProvider
          .when('/', { templateUrl: 'home/index.html', controller: 'IndexController' })
          .otherwise({ redirectTo: '/' });

      }]);
})(); 