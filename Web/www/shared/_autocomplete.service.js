(function () {
  'use strict';

  angular
    .module('services')
    .factory('_autocomplete', ['$http', _autocomplete]);

  function _autocomplete($http) {
    var service = {};

    service.getAddressHint = function (val) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function (response) {
        return response.data.results.map(function (item) {
          return item.formatted_address;
        });
      });
    };

    return service;
  }
})();
