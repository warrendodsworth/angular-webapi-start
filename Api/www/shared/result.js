(function () {
  'use strict';

  angular
      .module('directives')
      .directive('result', result);

  result.$inject = ['notifySvc'];

  function result(notifySvc) {
    var directive = {
      restrict: 'EA',
      template: '<toasty></toasty>',
      scope: {
        res: '='
      },
      link: function (scope, element, attrs) {

        //global error handler
        scope.$on('responseError', function (event, res) {
          notify(res);
        })

        //watch for incoming changes
        scope.$watch('res', function (res) {
          if (res) {
            notify(res);
          }
        })

        function notify(res) {
          if (res.status === -1) return; //ERR_CONNECTION_REFUSED

          if (!res.data && angular.isString(res)) {
            notifySvc.success(res);
          }
          else if (res.data.modelState) { //400 bad request model state errs
            angular.forEach(res.data.modelState, function (propertyErrors, key) {
              angular.forEach(propertyErrors, function (error, key) {
                notifySvc.warning(error);
              })
            });
          }
          else if (res.data.message || res.data.error_description) { //500 or 400 auth special case
            notifySvc.error(res.data.message || res.data.error_description);
          }

        }
      }
    };
    return directive;
  }

})();