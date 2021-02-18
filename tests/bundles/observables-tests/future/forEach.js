"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "Observable.prototype has a forEach property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable.prototype, "forEach", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Argument must be a function": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var result = Observable.prototype.forEach.call({}, {});

    test._("If the first argument is not a function, a promise is returned").assert(result instanceof Promise);

    return result.then(function (_) {
      return null;
    }, function (e) {
      return e;
    }).then(function (error) {
      test._("The promise is rejected with a TypeError").assert(Boolean(error)).assert(error instanceof TypeError);
    });
  },
  "Subscribe is called asynchronously": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var observer = null,
        list = [];
    Promise.resolve().then(function (_) {
      return list.push(1);
    });
    var promise = Observable.prototype.forEach.call({
      subscribe: function (x) {
        list.push(2);
        x.complete();
      }
    }, function (_) {
      return null;
    }).then(function (_) {
      test._("Subscribe is called in a job").equals(list, [1, 2]);
    });

    test._("Subscribe is not called synchronously").equals(list, []);

    return promise;
  },
  "Subscribe is called on the 'this' value": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var observer = null,
        called = 0;
    return Observable.prototype.forEach.call({
      subscribe: function (x) {
        called++;
        observer = x;
        x.complete();
      }
    }, function (_) {
      return null;
    }).then(function (_) {
      test._("The subscribe method is called with an observer").equals(called, 1).equals(typeof observer, "object").equals(typeof observer.next, "function");
    });
  },
  "Error rejects the promise": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var error = new Error();
    return new Observable(function (observer) {
      observer.error(error);
    }).forEach(function (_) {
      return null;
    }).then(function (_) {
      return null;
    }, function (e) {
      return e;
    }).then(function (value) {
      test._("Sending error rejects the promise with the supplied value").equals(value, error);
    });
  },
  "Complete resolves the promise": function (test, _ref6) {
    var Observable = _ref6.Observable;
    var token = {};
    return new Observable(function (observer) {
      observer.complete(token);
    }).forEach(function (_) {
      return null;
    }).then(function (x) {
      return x;
    }, function (e) {
      return null;
    }).then(function (value) {
      test._("Sending complete resolves the promise with the supplied value").equals(value, token);
    });
  },
  "The callback is called with the next value": function (test, _ref7) {
    var Observable = _ref7.Observable;
    var values = [],
        thisArg;
    return new Observable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).forEach(function (x) {
      thisArg = this;
      values.push(x);
    }).then(function (_) {
      test._("The callback receives each next value").equals(values, [1, 2, 3])._("The callback receives undefined as the this value").equals(thisArg, undefined);
    });
  },
  "If the callback throws an error, the promise is rejected": function (test, _ref8) {
    var Observable = _ref8.Observable;
    var error = new Error();
    return new Observable(function (observer) {
      observer.next(1);
    }).forEach(function (_) {
      throw error;
    }).then(function (_) {
      return null;
    }, function (e) {
      return e;
    }).then(function (value) {
      test._("The promise is rejected with the thrown value").equals(value, error);
    });
  },
  "If the callback throws an error, the callback function is not called again": function (test, _ref9) {
    var Observable = _ref9.Observable;
    var callCount = 0;
    return new Observable(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
    }).forEach(function (x) {
      callCount++;
      throw new Error();
    })["catch"](function (x) {
      test._("The callback is not called again after throwing an error").equals(callCount, 1);
    });
  }
};