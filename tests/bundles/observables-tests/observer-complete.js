"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "SubscriptionObserver.prototype has a complete method": function (test, _ref) {
    var Observable = _ref.Observable;
    var observer;
    new Observable(function (x) {
      observer = x;
    }).subscribe({});
    testMethodProperty(test, Object.getPrototypeOf(observer), "complete", {
      configurable: true,
      writable: true,
      length: 0
    });
  },
  "Input value": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var token = {};
    new Observable(function (observer) {
      observer.complete(token, 1, 2);
    }).subscribe({
      complete: function () {
        test._("Arguments are not forwarded").equals(arguments.length, 0);
      }
    });
  },
  "Return value": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Suppresses the value returned from the observer").equals(observer.complete(), undefined);

      test._("Returns undefined when closed").equals(observer.complete(), undefined);
    }).subscribe({
      complete: function () {
        return token;
      }
    });
  },
  "Thrown error": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Catches errors thrown from the observer").equals(observer.complete(), undefined);
    }).subscribe({
      complete: function () {
        throw new Error();
      }
    });
  },
  "Method lookup": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var observer,
        observable = new Observable(function (x) {
      observer = x;
    });
    observable.subscribe({});

    test._("If property does not exist, then complete returns undefined").equals(observer.complete(), undefined);

    observable.subscribe({
      complete: undefined
    });

    test._("If property is undefined, then complete returns undefined").equals(observer.complete(), undefined);

    observable.subscribe({
      complete: null
    });

    test._("If property is null, then complete returns undefined").equals(observer.complete(), undefined);

    observable.subscribe({
      complete: {}
    });

    test._("If property is not a function, then complete returns undefined").equals(observer.complete(), undefined);

    var actual = {};
    var calls = 0;
    observable.subscribe(actual);

    actual.complete = function (_) {
      return calls++;
    };

    test._("Method is not accessed until complete is called").equals(observer.complete() || calls, 1);

    var called = 0;
    observable.subscribe({
      get complete() {
        called++;
        return function () {};
      },

      error: function () {}
    });
    observer.error(new Error());
    observer.complete();

    test._("Method is not accessed when subscription is closed").equals(called, 0);

    called = 0;
    observable.subscribe({
      get complete() {
        called++;
        return function () {};
      }

    });
    observer.complete();

    test._("Property is only accessed once during a lookup").equals(called, 1);

    called = 0;
    observable.subscribe({
      next: function () {
        called++;
      },

      get complete() {
        called++;
        observer.next();
        return function () {
          return 1;
        };
      }

    });
    observer.complete();

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
    observer.complete();

    test._("Cleanup function is called when observer does not have a complete method").equals(called, 1);

    called = 0;
    observable.subscribe({
      complete: function () {
        return 1;
      }
    });
    observer.complete();

    test._("Cleanup function is called when observer has a complete method").equals(called, 1);

    called = 0;
    observable.subscribe({
      get complete() {
        throw new Error();
      }

    });
    observer.complete();

    test._("Cleanup function is called when method lookup throws").equals(called, 1);

    called = 0;
    observable.subscribe({
      complete: function () {
        throw new Error();
      }
    });
    observer.complete();

    test._("Cleanup function is called when method throws").equals(called, 1);
  }
};