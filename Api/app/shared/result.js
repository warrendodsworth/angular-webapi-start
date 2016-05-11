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
      template: '<div ng-if="msg" class="alert" ng-class="msg.success ? \'alert-success\' : \'alert-danger\'" ><p ng-bind-html="msg.text"></p></div>',
      scope: {
        res: '='
      },
      link: function (scope, element, attrs) {

        scope.$on('responseError', function (res) {
          handleError(res);
        })

        scope.$watch('res', function (value) {
          if (value) {
            handleError(value);
          }
        })

        function handleError() {
          scope.msg = {
            text: !scope.res.data ? scope.res : errors(scope.res),
            success: !scope.res.data
          }

          $timeout(function () {
            scope.res = null;
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