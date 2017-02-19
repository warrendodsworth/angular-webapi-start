(function () {
  'use strict';

  angular
  .module('app')
  .directive('focusMe', function ($timeout, $parse) {
    return {
      //focus an element on variable change
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
  });
})();


//vm.onFocus = function (e) {
//  $timeout(function () {
//    $(e.target).trigger('input');
//  });
//};