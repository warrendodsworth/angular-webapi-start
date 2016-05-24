(function () {
  'use strict';

  angular
      .module('app')
      .directive('result', result);

  result.$inject = ['toasty'];

  function result(toasty) {
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
          console.log(res);

          if (res.status === -1) return; //ERR_CONNECTION_REFUSED

          if (!res.data) {
            toasty.success({ title: 'Success!', msg: res });
          }
          else if (res.data.modelState) {
            angular.forEach(res.data.modelState, function (propertyErrors, key) {
              angular.forEach(propertyErrors, function (error, key) {
                toasty.warning({ title: 'Oops!', msg: error });
              })
            });
          }
          else if (res.data.message || res.data.error_description) {
            toasty.error({ title: 'Error :(', msg: res.data.message || res.data.error_description });
          }
         
        }
      }
    };
    return directive;
  }

})();