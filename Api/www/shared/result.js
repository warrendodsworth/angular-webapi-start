(function () {
  'use strict';

  angular
      .module('app')
      .directive('result', result);

  result.$inject = ['toasty'];

  function result(toasty) {
    // Usage:
    //     <result></result>
    //      res: text value success msg passed in
    var directive = {
      restrict: 'EA',
      template: '<toasty></toasty>',
      scope: {
        res: '='
      },
      link: function (scope, element, attrs) {

        //global error handler
        scope.$on('responseError', function (res) {
          handleError(res);
        })

        //watch for incoming changes
        scope.$watch('res', function (res) {
          if (res) {
            handleError(res);
          }
        })

        function handleError(res) {
          console.log(res);
          if (!res.data) {
            toasty.success({ title: 'Success!', msg: res });
          } else {
            angular.forEach(errors(res), function (error, key) {
              toasty.warning({ title: 'Oops!', msg: error });
            })
          }
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