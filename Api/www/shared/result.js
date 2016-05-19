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
      restrict: 'EA',
      template: '<div ng-if="messages" class="alert" ng-class="success ? \'alert-success\' : \'alert-danger\'" >' +
                  '<p ng-repeat="msg in messages">{{msg}}</p>' +
                '</div>',
      scope: {
        res: '='
      },
      link: function (scope, element, attrs) {

        //global error handler
        scope.$on('responseError', function (res) {
          handleError(res);
        })

        //watch for incoming changes
        scope.$watch('res', function (value) {
          if (value) {
            handleError(value);
          }
        })

        function handleError() {
          scope.messages = !scope.res.data ? [scope.res] : errors(scope.res);
          scope.success = !scope.res.data;

          $timeout(function () {
            scope.messages = null;
          }, 5000);
        }
      }
    };
    return directive;



    function errors(res) {
      var errors = [], validationSummary;
      if (res.data.modelState) {
        $.each(res.data.modelState, function (i, propertyErrors) {
          errors.push.apply(errors, propertyErrors);
        });

        validationSummary = errors;
      } else {
        errors.push(res.data.message || res.data.error_description);
        validationSummary = errors;
      }

      return validationSummary;
    }
  }

})();