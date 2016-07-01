(function () {
  'use strict';
  // This service reads data from the query string into a filter object.
  //http://www.metaltoad.com/blog/managing-querystring-angular-location
  angular.module('services').factory('QsService', QsService);
  function QsService($location) {
    var service = {};
    service.toFilters = function (filterObj) {
      //Set defaults
      filterObj = filterObj || {};
      filterObj.search = filterObj.search || '';
      filterObj.page = filterObj.page || 1;
      filterObj.show = filterObj.show || 10;
      filterObj.action = filterObj.action || 'list';
      var qs = $location.search();
      for (var param in filterObj) {
        if (param in qs) {
          filterObj[param] = qs[param];
        }
      }
      return filterObj;
    };
    service.toQs = function (filters) {
      var qs = '?';
      for (var f in filters) {
        qs += f + '=' + filters[f] + '&';
      }
      $location.search(filters);
      return qs.slice(0, -1);
    };
    return service;
  }
}());