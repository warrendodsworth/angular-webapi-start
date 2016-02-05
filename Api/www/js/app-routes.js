(function () {
    'use strict';

    //Routes
    angular
        .module('app')
        .config(['$routeProvider', function ($routeProvider) {

            //Home
            $routeProvider.when('/', { templateUrl: '../home/index.html', controller: 'IndexController' });

            //Account
            $routeProvider.when('/login', { templateUrl: '../account/login.html', controller: 'LoginController' })
                .when('/register', { templateUrl: '../account/register.html', controller: 'RegisterController' })
                .when('/manage', { templateUrl: '../account/manage/manage.html', controller: 'ManageController' })
                .when('/manage/logins', { templateUrl: '../account/manage/manageLogins.html', controller: 'ManageLoginsController' });

            //User
            $routeProvider.when('/notes/create', { templateUrl: '../user/notes/create.html', controller: 'Notes.CreateController' });

            $routeProvider.when('/facebook', { templateUrl: '../user/facebook.html', controller: 'FacebookController' });

            $routeProvider.otherwise({ redirectTo: '/' });

        }])
    ;
})();