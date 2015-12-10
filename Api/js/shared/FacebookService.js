(function () {
  'use strict';

  angular
    .module('app')
    .factory('FacebookService', ['$q', '$window', function ($q, $window) {

      var service = {};

      $window.fbAsyncInit = function () {
        FB.init({
          appId: '292179600807388',
          status: true,
          cookie: true,
          xfbml: true,
          version: 'v2.4'
        });
        console.log('Facebook loaded');
      };

      service.api = function (url, params) {
        var deferred = $q.defer();

        FB.api(url, params, function (res) {
          if (!res || res.error) {
            deferred.reject('Error occured');
          } else {
            deferred.resolve(res);
          }
        });

        return deferred.promise;
      }

      return service;
    }]);
})();