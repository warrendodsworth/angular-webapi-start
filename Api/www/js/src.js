(function () {
    'use strict';

    //Modules
    angular.module('app', ['ngRoute', 'ngSanitize',

                           'controllers',

                           'ngFacebook',
                           'LocalStorageModule']);

    angular.module('controllers', ['services']);

    angular.module('services', []);

    //Plugins
    angular
       .module('app')
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('AuthInterceptorService');
       }])
       .config(['$facebookProvider', function ($facebookProvider) {
           $facebookProvider.setAppId('292179600807388')
                            .setPermissions("email,user_likes");
       }])
       
      .run(['AccountService', function (AccountService) {
          AccountService.getIdentity();
      }])
      .run(function ($rootScope) {
          // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.

          // Load the facebook SDK asynchronously
          (function (d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) { return; }
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
      });


    //Routes
    angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

          //Home
          $routeProvider.when('/', { templateUrl: '/home/index.html', controller: 'IndexController' });

          //Account
          $routeProvider.when('/login', { templateUrl: '/account/login.html', controller: 'LoginController' })
                        .when('/register', { templateUrl: '/account/register.html', controller: 'RegisterController' })
                        .when('/manage', { templateUrl: '/account/manage/manage.html', controller: 'ManageController' })
                        .when('/manage/logins', { templateUrl: '/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

          //User
          $routeProvider.when('/notes/create', { templateUrl: '/user/notes/create.html', controller: 'Notes.CreateController' });

          $routeProvider.when('/facebook', { templateUrl: '/user/facebook.html', controller: 'FacebookController' });


          $routeProvider.otherwise({ redirectTo: '/' });

      }]);

})();
(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('ExternalLoginController', ExternalLoginController);

  ExternalLoginController.$inject = ['$http', '$scope', '$location', '$window', 'localStorageService', 'AccountService'];

  //Return from Facebook to this view, which should read #params and get the access token
  function ExternalLoginController($http, $scope, $location, $window, localStorageService, AccountService) {

    //Callback access_token
    var hash = $location.path().split(/[=&]+/);
    if (hash[0] == '/error') {
      $scope.action = 'error';
      return;
    }

    var accessToken = hash[1];
    var expiresIn = hash[3];
    var tokenType = hash[5];
    console.log('Access token');


    AccountService.getUserInfo(accessToken).then(function (res) {
      console.log('Get User Info');
      console.log(res.data);

      //1st time user - register local account
      $scope.loginProvider = res.data.loginProvider;
      $scope.model = {
        name: res.data.name,
        username: res.data.username,
        email: res.data.email
      };

      //2nd time user has local account
      if (res.data.hasRegistered) {
        $scope.action = 'process';

        if (AccountService.identity.isAuth) {
          //Add login (user already registered)
          AccountService.addExternalLogin({ externalAccessToken: accessToken }).then(function (res) {
            $window.location.href = '/#/manage/logins?m=added';
          }, function (res) {
            $scope.res = res;
          });

        } else {
          //Log user in
          localStorageService.set('authorizationData', {
            token: accessToken,
            tokenType: tokenType,
            expiresIn: expiresIn
          });
          $window.location.href = '/#/';
        }
      } else {
        $scope.action = 'register';
      }
    }, function (res) {
      $scope.res = res;
    })


    $scope.registerExternal = function (model) {
      AccountService.registerExternal(model, accessToken).then(function (res) {
        $scope.res = 'You\'ve registered successfully';
        console.log(res);

        localStorageService.set('authorizationData', {
          token: res.data.access_token,
          tokenType: res.data.token_type,
          expiresIn: res.data.expires_in
        });

        $window.location.href = '/#/';
      }, function (res) {
        $scope.res = res;
      });
    };
  }

})();

(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('LoginController', ['$scope', '$location', 'AccountService', LoginController]);

    function LoginController($scope, $location, AccountService) {

        AccountService.getExternalLogins().then(function (res) {
            $scope.logins = res.data;
        });


        $scope.login = function (model) {
            AccountService.login(model).then(function (res) {
                $location.path('/').search('m', 'welcome');
            },
             function (res) {
                 $scope.res = res;
             });
        };

    }

})();

(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('RegisterController', ['$scope', '$location', '$timeout', 'AccountService', RegisterController]);

  function RegisterController($scope, $location, $timeout, AccountService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.register = function (model) {

      AccountService.register(model).then(function (res) {
        $scope.savedSuccessfully = true;
        $scope.message = "User has been registered successfully,  you will be redicted to login page in 2 seconds.";

        $timeout(function () {
          $location.path('/login');
        }, 2000);

      },
       function (res) {
         var errors = [];
         for (var key in res.data.modelState) {
           for (var i = 0; i < res.data.modelState[key].length; i++) {
             errors.push(res.data.modelState[key][i]);
           }
         }
         $scope.message = "Failed to register user due to:" + errors.join(' ');
       });
    };
  }
})();

(function () {
    'use strict';

    //Index
    angular.module('controllers')
           .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', '$http', '$location'];

    function IndexController($scope, $http, $location) {

        $http.get('/api/notes').then(function (res) {
            $scope.notes = res.data;
        });

    }
})();
(function () {
    'use strict';

    //Modules
    angular.module('app', ['ngRoute', 'ngSanitize',

                           'controllers',

                           'ngFacebook',
                           'LocalStorageModule']);

    angular.module('controllers', ['services']);

    angular.module('services', []);

    //Plugins
    angular
       .module('app')
       .config(['$httpProvider', function ($httpProvider) {
           $httpProvider.interceptors.push('AuthInterceptorService');
       }])
       .config(['$facebookProvider', function ($facebookProvider) {
           $facebookProvider.setAppId('292179600807388')
                            .setPermissions("email,user_likes");
       }])
       
      .run(['AccountService', function (AccountService) {
          AccountService.getIdentity();
      }])
      .run(function ($rootScope) {
          // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.

          // Load the facebook SDK asynchronously
          (function (d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) { return; }
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
      });


    //Routes
    angular
      .module('app')
      .config(['$routeProvider', function ($routeProvider) {

          //Home
          $routeProvider.when('/', { templateUrl: '/home/index.html', controller: 'IndexController' });

          //Account
          $routeProvider.when('/login', { templateUrl: '/account/login.html', controller: 'LoginController' })
                        .when('/register', { templateUrl: '/account/register.html', controller: 'RegisterController' })
                        .when('/manage', { templateUrl: '/account/manage/manage.html', controller: 'ManageController' })
                        .when('/manage/logins', { templateUrl: '/account/manage/manageLogins.html', controller: 'ManageLoginsController' });

          //User
          $routeProvider.when('/notes/create', { templateUrl: '/user/notes/create.html', controller: 'Notes.CreateController' });

          $routeProvider.when('/facebook', { templateUrl: '/user/facebook.html', controller: 'FacebookController' });


          $routeProvider.otherwise({ redirectTo: '/' });

      }]);

})();
(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('ExternalLoginController', ExternalLoginController);

  ExternalLoginController.$inject = ['$http', '$scope', '$location', '$window', 'localStorageService', 'AccountService'];

  //Return from Facebook to this view, which should read #params and get the access token
  function ExternalLoginController($http, $scope, $location, $window, localStorageService, AccountService) {

    //Callback access_token
    var hash = $location.path().split(/[=&]+/);
    if (hash[0] == '/error') {
      $scope.action = 'error';
      return;
    }

    var accessToken = hash[1];
    var expiresIn = hash[3];
    var tokenType = hash[5];
    console.log('Access token');


    AccountService.getUserInfo(accessToken).then(function (res) {
      console.log('Get User Info');
      console.log(res.data);

      //1st time user - register local account
      $scope.loginProvider = res.data.loginProvider;
      $scope.model = {
        name: res.data.name,
        username: res.data.username,
        email: res.data.email
      };

      //2nd time user has local account
      if (res.data.hasRegistered) {
        $scope.action = 'process';

        if (AccountService.identity.isAuth) {
          //Add login (user already registered)
          AccountService.addExternalLogin({ externalAccessToken: accessToken }).then(function (res) {
            $window.location.href = '/#/manage/logins?m=added';
          }, function (res) {
            $scope.res = res;
          });

        } else {
          //Log user in
          localStorageService.set('authorizationData', {
            token: accessToken,
            tokenType: tokenType,
            expiresIn: expiresIn
          });
          $window.location.href = '/#/';
        }
      } else {
        $scope.action = 'register';
      }
    }, function (res) {
      $scope.res = res;
    })


    $scope.registerExternal = function (model) {
      AccountService.registerExternal(model, accessToken).then(function (res) {
        $scope.res = 'You\'ve registered successfully';
        console.log(res);

        localStorageService.set('authorizationData', {
          token: res.data.access_token,
          tokenType: res.data.token_type,
          expiresIn: res.data.expires_in
        });

        $window.location.href = '/#/';
      }, function (res) {
        $scope.res = res;
      });
    };
  }

})();

(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('LoginController', ['$scope', '$location', 'AccountService', LoginController]);

    function LoginController($scope, $location, AccountService) {

        AccountService.getExternalLogins().then(function (res) {
            $scope.logins = res.data;
        });


        $scope.login = function (model) {
            AccountService.login(model).then(function (res) {
                $location.path('/').search('m', 'welcome');
            },
             function (res) {
                 $scope.res = res;
             });
        };

    }

})();

(function () {
  'use strict';

  angular
      .module('controllers')
      .controller('RegisterController', ['$scope', '$location', '$timeout', 'AccountService', RegisterController]);

  function RegisterController($scope, $location, $timeout, AccountService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.register = function (model) {

      AccountService.register(model).then(function (res) {
        $scope.savedSuccessfully = true;
        $scope.message = "User has been registered successfully,  you will be redicted to login page in 2 seconds.";

        $timeout(function () {
          $location.path('/login');
        }, 2000);

      },
       function (res) {
         var errors = [];
         for (var key in res.data.modelState) {
           for (var i = 0; i < res.data.modelState[key].length; i++) {
             errors.push(res.data.modelState[key][i]);
           }
         }
         $scope.message = "Failed to register user due to:" + errors.join(' ');
       });
    };
  }
})();

(function () {
    'use strict';

    //Index
    angular.module('controllers')
           .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', '$http', '$location'];

    function IndexController($scope, $http, $location) {

        $http.get('/api/notes').then(function (res) {
            $scope.notes = res.data;
        });

    }
})();
(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('NavbarController', ['$scope', '$location', 'AccountService', NavbarController]);

    function NavbarController($scope, $location, AccountService) {

        $scope.identity = AccountService.identity;

        $scope.logout = function () {
            AccountService.logout();
            $location.path('/');
        }
    }
})();


//$scope.$on('user:logout', function (event, data) {
//    $scope.identity = data;
//});
(function () {
  'use strict';

  angular
      .module('app')
      .directive('result', result);

  result.$inject = ['$window', '$timeout'];

  function result($window, $timeout) {
    // Usage:
    //     <result></result>
    // Creates:
    // 
    var directive = {
      link: link,
      restrict: 'EA',
      template: '<div ng-if="msg" class="alert" ng-class="msg.success ? \'alert-success\' : \'alert-danger\'" ><p ng-bind-html="msg.text"></p></div>',
      scope: {
        res: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {

      scope.$watch('res', function (value) {
        if (value) {
          scope.msg = {
            text: !scope.res.data ? scope.res : errors(scope.res),
            success: !scope.res.data
          }

          $timeout(function () {
            scope.res = null;
          }, 5000);
        }
      })
    }

    function errors(res) {
      var errors = [], validationSummary;
      if (res.data.modelState) {
        $.each(res.data.modelState, function (i, propertyErrors) {
          errors.push.apply(errors, propertyErrors);
        });

        validationSummary = errors.join('</br>');
      } else {
        errors.push(res.data.message || res.data.error_description);
        validationSummary = errors.join('');
      }

      if (validationSummary)
        validationSummary = validationSummary.trim();

      return validationSummary;
    }
  }

})();
(function () {
  'use strict';

  angular
      .module('app')
      .controller('FacebookController', FacebookController);

  FacebookController.$inject = ['$scope', '$http', '$facebook'];

  function FacebookController($scope, $http, $facebook) {
    $scope.title = 'FacebookController';

    var authData, connected;

    $facebook.getLoginStatus().then(function (res) {
      if (res.status != 'connected') {
        $facebook.login().then(function (res) {
          if (res.status == 'connected') {
            connected = true;
            authData = {
              accessToken: res.authResponse.accessToken,
              expiresIn: res.authResponse.expiresIn,
              userId: res.authResponse.userID
            };
          }
        });
      }
    });


    $facebook.api('/me').then(function (res) {
      $scope.user = res;
    });

    $facebook.api('/' + authData.userId + '/photos').then(function (res) {
        console.log(res);
    });

  }
})();


//$facebook.api('/me', { fields: 'last_name' }).then(function (res) {
//  $scope.result = res;
//});

(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('ManageLoginsController', ManageLoginsController);

    ManageLoginsController.$inject = ['$scope', 'AccountService'];

    function ManageLoginsController($scope, AccountService) {
        AccountService.getManageLogins().then(function (res) {
            $scope.logins = res.data.logins;
            $scope.externalLoginProviders = res.data.externalLoginProviders;
        });

        $scope.removeLogin = function (login, index) {
            AccountService.removeLogin(login).then(function (res) {
                $scope.res = 'Removed';
                $scope.logins.splice(index, 1);
            });
        }
    }

    angular
       .module('controllers')
       .controller('ManageController', ManageController);

    ManageController.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ManageController($scope, $location, $timeout, AccountService) {
        AccountService.getCurrentUser().then(function (res) {
            $scope.user = res.data;
        });

        $scope.deactivate = function () {
            AccountService.deactivateAccount().then(function (res) {
                $scope.res = 'Account Deactivated';
                AccountService.logout();

                $timeout(function () {
                    $location.path('/');
                }, 2000);
            });
        }
    }

    angular
          .module('controllers')
          .controller('ForgotPasswordController', ForgotPassword);

    ForgotPassword.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ForgotPassword($scope, $location, $timeout, AccountService) {

        $scope.forgotPassword = function (model) {
            AccountService.forgotPassword(model).then(function (res) {
                $scope.res = 'We\'ve sent you a link';

                $timeout(function () {
                    $location.path('/');
                }, 4000);
            }, function (res) {
                $scope.res = res;
            });
        }
    }

})();
(function () {
    'use strict';

    angular
      .module('services')
      .factory('AccountService', AccountService);

    AccountService.$inject = ['$q', '$http', '$rootScope', 'localStorageService'];

    function AccountService($q, $http, $rootScope, localStorageService) {

        var service = {};

        //ACCOUNT

        service.identity = {
            isAuth: false,
            username: ''
        };

        //Register
        service.register = function (model) {
            service.logout();
            return $http.post('/api/account/register', model);
        };

        //Login
        service.login = function (model) {

            var data = "grant_type=password&username=" + model.username + "&password=" + model.password;

            var deferred = $q.defer();

            $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {

                localStorageService.set('authorizationData', {
                    token: res.data.access_token,
                    tokenType: res.data.token_type,
                    expiresIn: res.data.expires_in,

                    name: res.data.name,
                    username: res.data.username
                });
                service.identity.isAuth = true;
                service.identity.username = res.data.username;
                service.identity.name = res.data.name;

                deferred.resolve(res);
            }, function (res) {
                service.logout();
                deferred.reject(res);
            });

            return deferred.promise;
        };

        //Logout
        service.logout = function () {
            localStorageService.remove('authorizationData');


            service.identity.isAuth = false;
            service.identity.username = '';
            service.identity.name = '';

            //service.identity = {  
            //    isAuth: false,
            //    username: ''
            //};

            //$rootScope.$broadcast('user:logout', service.identity);   
            //Only required if you overwrite an entire service object, modifying the individual properties removes the need for broadcast
        };

        service.getIdentity = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                service.identity.isAuth = true;
                service.identity.username = authData.username;
                service.identity.name = authData.name;
            }
        };

        service.deactivateAccount = function () {
            return $http.put('/api/account/deactivate');
        }

        service.getCurrentUser = function () {
            return $http.get('/api/account/me');
        }

        //EXTERNAL LOGINS

        //Get User Info
        service.getUserInfo = function (accessToken) {
            var config = accessToken ? { headers: { 'Authorization': 'Bearer ' + accessToken } } : {};
            return $http.get('/api/account/UserInfo', config);
        }

        //Get External Logins
        service.getExternalLogins = function (returnUrl, generateState) {
            return $http.get('/api/account/externalLogins'
                            + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html')
                            + '&generateState=' + (generateState || false));
        };

        //Register External Login { email }
        service.registerExternal = function (model, externalAccessToken) {
            var config = externalAccessToken ? { headers: { 'Authorization': 'Bearer ' + externalAccessToken } } : {};
            return $http.post('/api/account/registerExternal', model, config);
        };

        //Add External Login { externalAccessToken }
        service.addExternalLogin = function (model) {
            return $http.post('/api/account/addExternalLogin', model);
        };

        //Remove Login { loginProvider, providerKey }
        service.removeLogin = function (model) {
            return $http.post('/api/account/removeLogin', model);
        };

        //Manage social logins
        service.getManageLogins = function (returnUrl) {
            return $http.get('/api/account/manageInfo'
                            + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html'));
        };


        //MANAGE
        service.forgotPassword = function (model) {
            return $http.post('/api/account/forgot-password', model);
        }


        return service;
    }

})();
(function () {
  'use strict';

  angular
    .module('app')
    .factory('AuthInterceptorService', AuthInterceptorService);

  AuthInterceptorService.$inject = ['$q', '$location', 'localStorageService'];

  function AuthInterceptorService($q, $location, localStorageService) {

    var service = {};

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    service.responseError = function (rejection) {
      if (rejection.status === 401) {
        $location.path('/login');
      }
      return $q.reject(rejection);
    };

    return service;
  }
})();
(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('Notes.CreateController', CreateController);

    CreateController.$inject = ['$scope', '$http', '$location', 'AccountService'];

    function CreateController($scope, $http, $location, AccountService) {
        $scope.title = 'Create Controller';

        if (!AccountService.identity.isAuth) {
            $location.path('/login').search('m', '401');
        }

        $scope.create = function (model) {

            $http.post('/api/notes', model).then(function (res) {
                $scope.res = 'Note Created';
                $location.path('/');
            }, function (res) {
                $scope.res = res;
            });

        };

    }
})();

!function(){"use strict";angular.module("app",["ngRoute","ngSanitize","controllers","ngFacebook","LocalStorageModule"]),angular.module("controllers",["services"]),angular.module("services",[]),angular.module("app").config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptorService")}]).config(["$facebookProvider",function(e){e.setAppId("292179600807388").setPermissions("email,user_likes")}]).run(["AccountService",function(e){e.getIdentity()}]).run(function(e){!function(e,t,n){var o,r=e.getElementsByTagName(t)[0];e.getElementById(n)||(o=e.createElement(t),o.id=n,o.src="//connect.facebook.net/en_US/sdk.js",r.parentNode.insertBefore(o,r))}(document,"script","facebook-jssdk")}),angular.module("app").config(["$routeProvider",function(e){e.when("/",{templateUrl:"/home/index.html",controller:"IndexController"}),e.when("/login",{templateUrl:"/account/login.html",controller:"LoginController"}).when("/register",{templateUrl:"/account/register.html",controller:"RegisterController"}).when("/manage",{templateUrl:"/account/manage/manage.html",controller:"ManageController"}).when("/manage/logins",{templateUrl:"/account/manage/manageLogins.html",controller:"ManageLoginsController"}),e.when("/notes/create",{templateUrl:"/user/notes/create.html",controller:"Notes.CreateController"}),e.when("/facebook",{templateUrl:"/user/facebook.html",controller:"FacebookController"}),e.otherwise({redirectTo:"/"})}])}(),function(){"use strict";function e(e,t,n,o,r,a){var i=n.path().split(/[=&]+/);if("/error"==i[0])return void(t.action="error");var c=i[1],s=i[3],u=i[5];console.log("Access token"),a.getUserInfo(c).then(function(e){console.log("Get User Info"),console.log(e.data),t.loginProvider=e.data.loginProvider,t.model={name:e.data.name,username:e.data.username,email:e.data.email},e.data.hasRegistered?(t.action="process",a.identity.isAuth?a.addExternalLogin({externalAccessToken:c}).then(function(e){o.location.href="/#/manage/logins?m=added"},function(e){t.res=e}):(r.set("authorizationData",{token:c,tokenType:u,expiresIn:s}),o.location.href="/#/")):t.action="register"},function(e){t.res=e}),t.registerExternal=function(e){a.registerExternal(e,c).then(function(e){t.res="You've registered successfully",console.log(e),r.set("authorizationData",{token:e.data.access_token,tokenType:e.data.token_type,expiresIn:e.data.expires_in}),o.location.href="/#/"},function(e){t.res=e})}}angular.module("controllers").controller("ExternalLoginController",e),e.$inject=["$http","$scope","$location","$window","localStorageService","AccountService"]}(),function(){"use strict";function e(e,t,n){n.getExternalLogins().then(function(t){e.logins=t.data}),e.login=function(o){n.login(o).then(function(e){t.path("/").search("m","welcome")},function(t){e.res=t})}}angular.module("controllers").controller("LoginController",["$scope","$location","AccountService",e])}(),function(){"use strict";function e(e,t,n,o){e.savedSuccessfully=!1,e.message="",e.register=function(r){o.register(r).then(function(o){e.savedSuccessfully=!0,e.message="User has been registered successfully,  you will be redicted to login page in 2 seconds.",n(function(){t.path("/login")},2e3)},function(t){var n=[];for(var o in t.data.modelState)for(var r=0;r<t.data.modelState[o].length;r++)n.push(t.data.modelState[o][r]);e.message="Failed to register user due to:"+n.join(" ")})}}angular.module("controllers").controller("RegisterController",["$scope","$location","$timeout","AccountService",e])}(),function(){"use strict";function e(e,t,n){t.get("/api/notes").then(function(t){e.notes=t.data})}angular.module("controllers").controller("IndexController",e),e.$inject=["$scope","$http","$location"]}(),function(){"use strict";function e(e,t,n){e.identity=n.identity,e.logout=function(){n.logout(),t.path("/")}}angular.module("controllers").controller("NavbarController",["$scope","$location","AccountService",e])}(),function(){"use strict";function e(e,t){function n(e,n,r){e.$watch("res",function(n){n&&(e.msg={text:e.res.data?o(e.res):e.res,success:!e.res.data},t(function(){e.res=null},5e3))})}function o(e){var t,n=[];return e.data.modelState?($.each(e.data.modelState,function(e,t){n.push.apply(n,t)}),t=n.join("</br>")):(n.push(e.data.message||e.data.error_description),t=n.join("")),t&&(t=t.trim()),t}var r={link:n,restrict:"EA",template:'<div ng-if="msg" class="alert" ng-class="msg.success ? \'alert-success\' : \'alert-danger\'" ><p ng-bind-html="msg.text"></p></div>',scope:{res:"="}};return r}angular.module("app").directive("result",e),e.$inject=["$window","$timeout"]}(),function(){"use strict";function e(e,t,n){e.title="FacebookController";var o,r;n.getLoginStatus().then(function(e){"connected"!=e.status&&n.login().then(function(e){"connected"==e.status&&(r=!0,o={accessToken:e.authResponse.accessToken,expiresIn:e.authResponse.expiresIn,userId:e.authResponse.userID})})}),n.api("/me").then(function(t){e.user=t}),n.api("/"+o.userId+"/photos").then(function(e){console.log(e)})}angular.module("app").controller("FacebookController",e),e.$inject=["$scope","$http","$facebook"]}(),function(){"use strict";function e(e,t){t.getManageLogins().then(function(t){e.logins=t.data.logins,e.externalLoginProviders=t.data.externalLoginProviders}),e.removeLogin=function(n,o){t.removeLogin(n).then(function(t){e.res="Removed",e.logins.splice(o,1)})}}function t(e,t,n,o){o.getCurrentUser().then(function(t){e.user=t.data}),e.deactivate=function(){o.deactivateAccount().then(function(r){e.res="Account Deactivated",o.logout(),n(function(){t.path("/")},2e3)})}}function n(e,t,n,o){e.forgotPassword=function(r){o.forgotPassword(r).then(function(o){e.res="We've sent you a link",n(function(){t.path("/")},4e3)},function(t){e.res=t})}}angular.module("controllers").controller("ManageLoginsController",e),e.$inject=["$scope","AccountService"],angular.module("controllers").controller("ManageController",t),t.$inject=["$scope","$location","$timeout","AccountService"],angular.module("controllers").controller("ForgotPasswordController",n),n.$inject=["$scope","$location","$timeout","AccountService"]}(),function(){"use strict";function e(e,t,n,o){var r={};return r.identity={isAuth:!1,username:""},r.register=function(e){return r.logout(),t.post("/api/account/register",e)},r.login=function(n){var a="grant_type=password&username="+n.username+"&password="+n.password,i=e.defer();return t.post("/token",a,{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(e){o.set("authorizationData",{token:e.data.access_token,tokenType:e.data.token_type,expiresIn:e.data.expires_in,name:e.data.name,username:e.data.username}),r.identity.isAuth=!0,r.identity.username=e.data.username,r.identity.name=e.data.name,i.resolve(e)},function(e){r.logout(),i.reject(e)}),i.promise},r.logout=function(){o.remove("authorizationData"),r.identity.isAuth=!1,r.identity.username="",r.identity.name=""},r.getIdentity=function(){var e=o.get("authorizationData");e&&(r.identity.isAuth=!0,r.identity.username=e.username,r.identity.name=e.name)},r.deactivateAccount=function(){return t.put("/api/account/deactivate")},r.getCurrentUser=function(){return t.get("/api/account/me")},r.getUserInfo=function(e){var n=e?{headers:{Authorization:"Bearer "+e}}:{};return t.get("/api/account/UserInfo",n)},r.getExternalLogins=function(e,n){return t.get("/api/account/externalLogins?returnUrl="+encodeURIComponent(e||"/js/account/externalLogin.html")+"&generateState="+(n||!1))},r.registerExternal=function(e,n){var o=n?{headers:{Authorization:"Bearer "+n}}:{};return t.post("/api/account/registerExternal",e,o)},r.addExternalLogin=function(e){return t.post("/api/account/addExternalLogin",e)},r.removeLogin=function(e){return t.post("/api/account/removeLogin",e)},r.getManageLogins=function(e){return t.get("/api/account/manageInfo?returnUrl="+encodeURIComponent(e||"/js/account/externalLogin.html"))},r.forgotPassword=function(e){return t.post("/api/account/forgot-password",e)},r}angular.module("services").factory("AccountService",e),e.$inject=["$q","$http","$rootScope","localStorageService"]}(),function(){"use strict";function e(e,t,n){var o={};return o.request=function(e){e.headers=e.headers||{};var t=n.get("authorizationData");return t&&(e.headers.Authorization="Bearer "+t.token),e},o.responseError=function(n){return 401===n.status&&t.path("/login"),e.reject(n)},o}angular.module("app").factory("AuthInterceptorService",e),e.$inject=["$q","$location","localStorageService"]}(),function(){"use strict";function e(e,t,n,o){e.title="Create Controller",o.identity.isAuth||n.path("/login").search("m","401"),e.create=function(o){t.post("/api/notes",o).then(function(t){e.res="Note Created",n.path("/")},function(t){e.res=t})}}angular.module("controllers").controller("Notes.CreateController",e),e.$inject=["$scope","$http","$location","AccountService"]}();
(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('NavbarController', ['$scope', '$location', 'AccountService', NavbarController]);

    function NavbarController($scope, $location, AccountService) {

        $scope.identity = AccountService.identity;

        $scope.logout = function () {
            AccountService.logout();
            $location.path('/');
        }
    }
})();


//$scope.$on('user:logout', function (event, data) {
//    $scope.identity = data;
//});
(function () {
  'use strict';

  angular
      .module('app')
      .directive('result', result);

  result.$inject = ['$window', '$timeout'];

  function result($window, $timeout) {
    // Usage:
    //     <result></result>
    // Creates:
    // 
    var directive = {
      link: link,
      restrict: 'EA',
      template: '<div ng-if="msg" class="alert" ng-class="msg.success ? \'alert-success\' : \'alert-danger\'" ><p ng-bind-html="msg.text"></p></div>',
      scope: {
        res: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {

      scope.$watch('res', function (value) {
        if (value) {
          scope.msg = {
            text: !scope.res.data ? scope.res : errors(scope.res),
            success: !scope.res.data
          }

          $timeout(function () {
            scope.res = null;
          }, 5000);
        }
      })
    }

    function errors(res) {
      var errors = [], validationSummary;
      if (res.data.modelState) {
        $.each(res.data.modelState, function (i, propertyErrors) {
          errors.push.apply(errors, propertyErrors);
        });

        validationSummary = errors.join('</br>');
      } else {
        errors.push(res.data.message || res.data.error_description);
        validationSummary = errors.join('');
      }

      if (validationSummary)
        validationSummary = validationSummary.trim();

      return validationSummary;
    }
  }

})();
(function () {
  'use strict';

  angular
      .module('app')
      .controller('FacebookController', FacebookController);

  FacebookController.$inject = ['$scope', '$http', '$facebook'];

  function FacebookController($scope, $http, $facebook) {
    $scope.title = 'FacebookController';

    var authData, connected;

    $facebook.getLoginStatus().then(function (res) {
      if (res.status != 'connected') {
        $facebook.login().then(function (res) {
          if (res.status == 'connected') {
            connected = true;
            authData = {
              accessToken: res.authResponse.accessToken,
              expiresIn: res.authResponse.expiresIn,
              userId: res.authResponse.userID
            };
          }
        });
      }
    });


    $facebook.api('/me').then(function (res) {
      $scope.user = res;
    });

    $facebook.api('/' + authData.userId + '/photos').then(function (res) {
        console.log(res);
    });

  }
})();


//$facebook.api('/me', { fields: 'last_name' }).then(function (res) {
//  $scope.result = res;
//});

(function () {
    'use strict';

    angular
      .module('controllers')
      .controller('ManageLoginsController', ManageLoginsController);

    ManageLoginsController.$inject = ['$scope', 'AccountService'];

    function ManageLoginsController($scope, AccountService) {
        AccountService.getManageLogins().then(function (res) {
            $scope.logins = res.data.logins;
            $scope.externalLoginProviders = res.data.externalLoginProviders;
        });

        $scope.removeLogin = function (login, index) {
            AccountService.removeLogin(login).then(function (res) {
                $scope.res = 'Removed';
                $scope.logins.splice(index, 1);
            });
        }
    }

    angular
       .module('controllers')
       .controller('ManageController', ManageController);

    ManageController.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ManageController($scope, $location, $timeout, AccountService) {
        AccountService.getCurrentUser().then(function (res) {
            $scope.user = res.data;
        });

        $scope.deactivate = function () {
            AccountService.deactivateAccount().then(function (res) {
                $scope.res = 'Account Deactivated';
                AccountService.logout();

                $timeout(function () {
                    $location.path('/');
                }, 2000);
            });
        }
    }

    angular
          .module('controllers')
          .controller('ForgotPasswordController', ForgotPassword);

    ForgotPassword.$inject = ['$scope', '$location', '$timeout', 'AccountService'];

    function ForgotPassword($scope, $location, $timeout, AccountService) {

        $scope.forgotPassword = function (model) {
            AccountService.forgotPassword(model).then(function (res) {
                $scope.res = 'We\'ve sent you a link';

                $timeout(function () {
                    $location.path('/');
                }, 4000);
            }, function (res) {
                $scope.res = res;
            });
        }
    }

})();
(function () {
    'use strict';

    angular
      .module('services')
      .factory('AccountService', AccountService);

    AccountService.$inject = ['$q', '$http', '$rootScope', 'localStorageService'];

    function AccountService($q, $http, $rootScope, localStorageService) {

        var service = {};

        //ACCOUNT

        service.identity = {
            isAuth: false,
            username: ''
        };

        //Register
        service.register = function (model) {
            service.logout();
            return $http.post('/api/account/register', model);
        };

        //Login
        service.login = function (model) {

            var data = "grant_type=password&username=" + model.username + "&password=" + model.password;

            var deferred = $q.defer();

            $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (res) {

                localStorageService.set('authorizationData', {
                    token: res.data.access_token,
                    tokenType: res.data.token_type,
                    expiresIn: res.data.expires_in,

                    name: res.data.name,
                    username: res.data.username
                });
                service.identity.isAuth = true;
                service.identity.username = res.data.username;
                service.identity.name = res.data.name;

                deferred.resolve(res);
            }, function (res) {
                service.logout();
                deferred.reject(res);
            });

            return deferred.promise;
        };

        //Logout
        service.logout = function () {
            localStorageService.remove('authorizationData');


            service.identity.isAuth = false;
            service.identity.username = '';
            service.identity.name = '';

            //service.identity = {  
            //    isAuth: false,
            //    username: ''
            //};

            //$rootScope.$broadcast('user:logout', service.identity);   
            //Only required if you overwrite an entire service object, modifying the individual properties removes the need for broadcast
        };

        service.getIdentity = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                service.identity.isAuth = true;
                service.identity.username = authData.username;
                service.identity.name = authData.name;
            }
        };

        service.deactivateAccount = function () {
            return $http.put('/api/account/deactivate');
        }

        service.getCurrentUser = function () {
            return $http.get('/api/account/me');
        }

        //EXTERNAL LOGINS

        //Get User Info
        service.getUserInfo = function (accessToken) {
            var config = accessToken ? { headers: { 'Authorization': 'Bearer ' + accessToken } } : {};
            return $http.get('/api/account/UserInfo', config);
        }

        //Get External Logins
        service.getExternalLogins = function (returnUrl, generateState) {
            return $http.get('/api/account/externalLogins'
                            + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html')
                            + '&generateState=' + (generateState || false));
        };

        //Register External Login { email }
        service.registerExternal = function (model, externalAccessToken) {
            var config = externalAccessToken ? { headers: { 'Authorization': 'Bearer ' + externalAccessToken } } : {};
            return $http.post('/api/account/registerExternal', model, config);
        };

        //Add External Login { externalAccessToken }
        service.addExternalLogin = function (model) {
            return $http.post('/api/account/addExternalLogin', model);
        };

        //Remove Login { loginProvider, providerKey }
        service.removeLogin = function (model) {
            return $http.post('/api/account/removeLogin', model);
        };

        //Manage social logins
        service.getManageLogins = function (returnUrl) {
            return $http.get('/api/account/manageInfo'
                            + '?returnUrl=' + encodeURIComponent(returnUrl || '/js/account/externalLogin.html'));
        };


        //MANAGE
        service.forgotPassword = function (model) {
            return $http.post('/api/account/forgot-password', model);
        }


        return service;
    }

})();
(function () {
  'use strict';

  angular
    .module('app')
    .factory('AuthInterceptorService', AuthInterceptorService);

  AuthInterceptorService.$inject = ['$q', '$location', 'localStorageService'];

  function AuthInterceptorService($q, $location, localStorageService) {

    var service = {};

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    service.responseError = function (rejection) {
      if (rejection.status === 401) {
        $location.path('/login');
      }
      return $q.reject(rejection);
    };

    return service;
  }
})();
(function () {
    'use strict';

    angular
        .module('controllers')
        .controller('Notes.CreateController', CreateController);

    CreateController.$inject = ['$scope', '$http', '$location', 'AccountService'];

    function CreateController($scope, $http, $location, AccountService) {
        $scope.title = 'Create Controller';

        if (!AccountService.identity.isAuth) {
            $location.path('/login').search('m', '401');
        }

        $scope.create = function (model) {

            $http.post('/api/notes', model).then(function (res) {
                $scope.res = 'Note Created';
                $location.path('/');
            }, function (res) {
                $scope.res = res;
            });

        };

    }
})();
