(function () {
  'use strict';

  angular
      .module('app')
      .directive('result', result);

  result.$inject = ['$sce', '$timeout'];

  function result($sce, $timeout) {
    // Usage:
    //     <result></result>
    // Creates:
    // 
    return {
      restrict: 'EA',
      template: '<div ng-if="msg" class="alert" ng-class="msg.success ? \'alert-success\' : \'alert-danger\'" ><p ng-bind-html="msg.text"></p></div>',
      scope: {
        res: '='
      },
      link: link
    };

    function link(scope, element, attrs) {

      scope.$watch('res', function (value) {
        if (value) {
          scope.msg = {
            text: !scope.res.data ? scope.res : $sce.trustAsHtml(errors(scope.res)),
            success: !scope.res.data
          }

          $timeout(function () {
            scope.res = null;
          }, 5000);
        }
      });

      scope.$on('responseError', function (event, res) {
        scope.msg = {
          text: $sce.trustAsHtml(errors(scope.res)),
          success: false
        }

        $timeout(function () {
          scope.res = null;
        }, 5000);
      });
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