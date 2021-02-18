"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "SubscriptionObserver.prototype has an error method": function (test, _ref) {
    var Observable = _ref.Observable;
    var observer;
    new Observable(function (x) {
      observer = x;
    }).subscribe({});
    testMethodProperty(test, Object.getPrototypeOf(observer), "error", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Input value": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var token = {};
    new Observable(function (observer) {
      observer.error(token, 1, 2);
    }).subscribe({
      error: function (value) {
        test._("Input value is forwarded to the observer").equals(value, token)._("Additional arguments are not forwarded").equals(arguments.length <= 1 ? 0 : arguments.length - 1, 0);
      }
    });
  },
  "Return value": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Suppresses the value returned from the observer").equals(observer.error(), undefined);

      test._("Returns undefined when closed").equals(observer.error(), undefined);
    }).subscribe({
      error: function () {
        return token;
      }
    });
  },
  "Thrown error": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Catches errors thrown from the observer").equals(observer.error(), undefined);
    }).subscribe({
      error: function () {
        throw new Error();
      }
    });
  },
  "Method lookup": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var observer,
        error = new Error(),
        observable = new Observable(function (x) {
      observer = x;
    });
    observable.subscribe({});

    test._("If property does not exist, then error returns undefined").equals(observer.error(error), undefined);

    observable.subscribe({
      error: undefined
    });

    test._("If property is undefined, then error returns undefined").equals(observer.error(error), undefined);

    observable.subscribe({
      error: null
    });

    test._("If property is null, then error returns undefined").equals(observer.error(error), undefined);

    observable.subscribe({
      error: {}
    });

    test._("If property is not a function, then error returns undefined").equals(observer.error(error), undefined);

    var actual = {};
    var calls = 0;
    observable.subscribe(actual);

    actual.error = function (_) {
      return calls++;
    };

    test._("Method is not accessed until error is called").equals(observer.error(error) || calls, 1);

    var called = 0;
    observable.subscribe({
      get error() {
        called++;
        return function () {};
      }

    });
    observer.complete();

    try {
      observer.error(error);
    } catch (x) {}

    test._("Method is not accessed when subscription is closed").equals(called, 0);

    called = 0;
    observable.subscribe({
      get error() {
        called++;
        return function () {};
      }

    });
    observer.error();

    test._("Property is only accessed once during a lookup").equals(called, 1);

    called = 0;
    observable.subscribe({
      next: function () {
        called++;
      },

      get error() {
        called++;
        observer.next();
        return function () {};
      }

    });
    observer.error();

    test._("When method lookup occurs, subscription is closed").equals(called, 1);
  },
  "Cleanup functions": function (test, _ref6) {
    var Observable = _ref6.Observable;
    var called, observer;
    var observable = new Observable(function (x) {
      observer = x;
      return function (_) {
        called++;
      };
    });
    called = 0;
    observable.subscribe({});

    try {
      observer.error();
    } catch (x) {}

    test._("Cleanup function is called when observer does not have an error method").equals(called, 1);

    called = 0;
    observable.subscribe({
      error: function () {
        return 1;
      }
    });
    observer.error();

    test._("Cleanup function is called when observer has an error method").equals(called, 1);

    called = 0;
    observable.subscribe({
      get error() {
        throw new Error();
      }

    });
    observer.error();

    test._("Cleanup function is called when method lookup throws").equals(called, 1);

    called = 0;
    observable.subscribe({
      error: function () {
        throw new Error();
      }
    });
    observer.error();

    test._("Cleanup function is called when method throws").equals(called, 1);
  }
};