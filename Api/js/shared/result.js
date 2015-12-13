(function () {
  'use strict';

  angular
    .module('app')
    .directive('result', [function () {
      return {
        restrict: 'E',
        template: '<p ng-show="validationSummary" ng-class="validationSummary ? \'alert alert-danger\' : \'\'">{{validationSummary}}</p>',
        scope: {
          res: '='
        },
        link: function (scope, elem, attrs) {

          var errors = [], validationSummary;
          var res = scope.res;
          console.log(scope.res);

          // eg - res.data.modelState
          if (res.data && res.data.modelState) {
            //If BadRequest(ModelState)
            $.each(res.data.modelState, function (i, propertyErrors) {
              errors.push.apply(errors, propertyErrors);
            });

            validationSummary = errors.join('</br>');
          } else if (res.data) {
            //else BadRequest("Message") or /token error
            if (res.data.message)
              errors.push(res.data.message);
            else
              errors.push(res.data.error_description);

            validationSummary = errors.join('');
          }


          if (validationSummary)
            validationSummary = validationSummary.trim();

          scope.validationSummary = validationSummary;
        }
      }
    }])

})();