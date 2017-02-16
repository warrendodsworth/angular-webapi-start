(function () {
  'use strict';

  angular
    .module('app')
    .filter('toLocal', toLocal);

  function toLocal() {
    return function (input, format) {
      var localDateTime = moment.utc(input).local();
      if (localDateTime == 'Invalid date')
        return '';
      else 
        return localDateTime.format(format || 'lll');
    };
  }
})();