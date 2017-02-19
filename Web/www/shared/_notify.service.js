(function () {
  'use strict';

  angular.module('services').factory('_notify', notifyService);

  notifyService.$inject = ['toasty'];

  function notifyService(toasty) {
    var service = {};
    service.success = function (msg) {
      toasty.success({
        title: 'Success!',
        msg: msg
      });
    };
    service.warning = function (msg) {
      toasty.warning({
        title: 'Oops!',
        msg: msg
      });
    };
    service.error = function (msg) {
      toasty.error({
        title: 'Error :(',
        msg: msg
      });
    };
    service.info = function (msg) {
      toasty.info({
        title: 'FYI',
        msg: msg
      });
    };
    service.wait = function (msg) {
      toasty.wait({
        title: 'Hang on',
        msg: msg
      });
    };
    service.handleErrors = function (res) {
      if (res.status === -1)
        return;
      //ERR_CONNECTION_REFUSED
      if (res.data.modelState) {
        //400 bad request model state errs
        angular.forEach(res.data.modelState, function (propertyErrors, key) {
          angular.forEach(propertyErrors, function (error, key) {
            service.warning(error);
          });
        });
      } else if (res.data.message || res.data.error_description) {
        //500 or 400 auth special case
        service.error(res.data.message || res.data.error_description);
      }
    };
    return service;
  }
}());