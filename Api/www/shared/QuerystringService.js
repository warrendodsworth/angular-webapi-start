(function () {
  'use strict';

  // This service reads data from the query string into a filter object.
  //http://www.metaltoad.com/blog/managing-querystring-angular-location
  angular
    .module('services')
    .service('QuerystringService', function ($location) {

      this.toFilters = function (filterObj) {
        //Set defaults
        filterObj = filterObj || {};
        filterObj.search = filterObj.search || '';
        filterObj.page = filterObj.page || 1;
        filterObj.show = filterObj.show || 10;

        var qs = $location.search();
        for (var param in filterObj) {
          if (param in qs) {
            filterObj[param] = qs[param];
          }
        }
        return filterObj;
      };

      this.toQs = function (filters) {
        var qs = '?';
        for (var f in filters) {
          qs += f + '=' + filters[f] + '&';
        }
        return qs.slice(0, -1);
      };

    });
})();



//this.updateQs = function(fld) {
//  // update the query string with the new filters
//  if ($scope.filters[fld] != '') {
//    $location.search(fld, $scope.filters[fld]);
//  } else {
//    // remove empty filters
//    $location.search(fld, null);
//  }
//}