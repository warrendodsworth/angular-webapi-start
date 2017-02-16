(function () {
  'use strict'; 

  angular
    .module('app')
    .directive('navbar', navbarDirective)
    .controller('NavbarController', navbarController);

  function navbarDirective() {
    return {
      restrict: 'E',
      templateUrl: '/www/shared/navbar.html',
      controller: 'NavbarController'
    };
  }

  navbarController.$inject = ['$scope', '$http', '$timeout', '$location', 'account'];
  function navbarController($scope, $http, $timeout, $location, _account) {
    $scope.identity = _account.identity;
    $scope.logout = function () {
      _account.logout();
      $location.path('/');
    };

    $scope.getPosts = function (q) {
      return $http.get('api/posts?search=' + q).then(function (res) {
        return res.data;
      });
    };

    $scope.onFocus = function (e) {
      $timeout(function () {
        $(e.target).trigger('input');
      });
    };
  }




  angular
     .module('app')
  .directive('focusMe', function ($timeout, $parse) {
    return {
      //scope: true,   // optionally create a child scope
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  })
  .directive('emptyTypeahead', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var secretEmptyKey = '[$empty$]';

        // this parser run before typeahead's parser
        modelCtrl.$parsers.unshift(function (inputValue) {
          var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
          modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
          return value;
        });

        // this parser run after typeahead's parser
        modelCtrl.$parsers.push(function (inputValue) {
          return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
        });
      }
    }
  });

}());