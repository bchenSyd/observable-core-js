"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "SubscriptionObserver.prototype has an next method": function (test, _ref) {
    var Observable = _ref.Observable;
    var observer;
    new Observable(function (x) {
      observer = x;
    }).subscribe({});
    testMethodProperty(test, Object.getPrototypeOf(observer), "next", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Input value": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var token = {};
    new Observable(function (observer) {
      observer.next(token, 1, 2);
    }).subscribe({
      next: function (value) {
        test._("Input value is forwarded to the observer").equals(value, token)._("Additional arguments are not forwarded").equals(arguments.length <= 1 ? 0 : arguments.length - 1, 0);
      }
    });
  },
  "Return value": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Suppresses the value returned from the observer").equals(observer.next(), undefined);

      observer.complete();

      test._("Returns undefined when closed").equals(observer.next(), undefined);
    }).subscribe({
      next: function () {
        return token;
      }
    });
  },
  "Thrown error": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var token = {};
    new Observable(function (observer) {
      test._("Catches errors thrown from the observer").equals(observer.next(), undefined);
    }).subscribe({
      next: function () {
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

    test._("If property does not exist, then next returns undefined").equals(observer.next(), undefined);

    observable.subscribe({
      next: undefined
    });

    test._("If property is undefined, then next returns undefined").equals(observer.next(), undefined);

    observable.subscribe({
      next: null
    });

    test._("If property is null, then next returns undefined").equals(observer.next(), undefined);

    observable.subscribe({
      next: {}
    });

    test._("If property is not a function, then next returns undefined").equals(observer.next(), undefined);

    var actual = {};
    var calls = 0;
    observable.subscribe(actual);

    actual.next = function (_) {
      return calls++;
    };

    test._("Method is not accessed until complete is called").equals(observer.next() || calls, 1);

    var called = 0;
    observable.subscribe({
      get next() {
        called++;
        return function () {};
      }

    });
    observer.complete();
    observer.next();

    test._("Method is not accessed when subscription is closed").equals(called, 0);

    called = 0;
    observable.subscribe({
      get next() {
        called++;
        return function () {};
      }

    });
    observer.next();

    test._("Property is only accessed once during a lookup").equals(called, 1);
  },
  "Cleanup functions": function (test, _ref6) {
    var Observable = _ref6.Observable;
    var observer;
    var observable = new Observable(function (x) {
      observer = x;
      return function (_) {};
    });
    var subscription = observable.subscribe({
      next: function () {
        throw new Error();
      }
    });
    observer.next();

    test._("Subscription is not closed when next throws an error").equals(subscription.closed, false);
  }
};