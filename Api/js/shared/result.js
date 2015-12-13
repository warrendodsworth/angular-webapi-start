(function () {
  'use strict';

  angular
    .module('app')
    .directive('result', [function () {
      return {
        restrict: 'E',
        template: '',
        scope: {
          model: '='
        },
        link: function (scope, elem, attrs) {

          var res = scope.model;

          var errors = [], validationSummary;

          // eg - res.data.modelState
          if (res.data.modelState) {
            //If BadRequest(ModelState)
            $.each(res.responseJSON.modelState, function (i, propertyErrors) {
              errors.push.apply(errors, propertyErrors);
            });

            validationSummary = errors.join('</br>');
          } else {
            //else BadRequest("Message")
            errors.push(res.data.message);
            validationSummary = errors.join('');
          }

          if (validationSummary)
            validationSummary = validationSummary.trim();

          scope.validationSummary = validationSummary;
        }
      }
    }])

})();