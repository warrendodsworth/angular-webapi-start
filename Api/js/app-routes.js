(function () {
  'use strict';

  //Routes
  angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

        //Account
        $routeProvider.when('/login', { templateUrl: 'js/account/login.html', controller: 'LoginController' })
            .when('/register', { templateUrl: 'js/account/register.html', controller: 'RegisterController' })
            .when('/manage', { templateUrl: 'js/account/manage/manage.html', controller: 'ManageController' })
            .when('/manage/logins', { templateUrl: 'js/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

        //User
        $routeProvider
          .when('/notes/create', { templateUrl: 'js/user/notes/create.html', controller: 'Notes.CreateController' });

        $routeProvider
          .when('/facebook', { templateUrl: 'js/user/facebook/facebook.html', controller: 'FacebookController' });

        $routeProvider
          .when('/', { templateUrl: 'js/home/index.html', controller: 'IndexController' })
          .otherwise({ redirectTo: '/' });

      }]);
})();