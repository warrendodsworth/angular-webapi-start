(function () {
  'use strict';

  angular
    .module('services')
    .factory('notifySvc', ['toasty', notifySvc]);

  function notifySvc(toasty) {
    var service = {};

    service.success = function (msg) {
      toasty.success({ title: 'Success!', msg: msg });
    };

    service.warning = function (msg) {
      toasty.warning({ title: 'Oops!', msg: msg });
    };

    service.error = function (msg) {
      toasty.error({ title: 'Error :(', msg: msg });
    };

    service.info = function (msg) {
      toasty.info({ title: 'FYI', msg: msg });
    };

    service.wait = function (msg) {
      toasty.wait({ title: 'Hang on', msg: msg });
    };

    return service;
  }
})();