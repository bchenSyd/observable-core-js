"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "SubscriptionObserver.prototype has a closed getter": function (test, _ref) {
    var Observable = _ref.Observable;
    var observer;
    new Observable(function (x) {
      observer = x;
    }).subscribe({});
    testMethodProperty(test, Object.getPrototypeOf(observer), "closed", {
      get: true,
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Returns false when the subscription is active": function (test, _ref2) {
    var Observable = _ref2.Observable;
    new Observable(function (observer) {
      test._("Returns false when the subscription is active").equals(observer.closed, false);
    }).subscribe({});
  },
  "Returns true when the subscription is closed": function (test, _ref3) {
    debugger;
    var Observable = _ref3.Observable;
    new Observable(function (observer) {
      debugger;
      observer.complete();

      test._("Returns true after complete is called").equals(observer.closed, true);
    }).subscribe({});
    new Observable(function (observer) {
      observer.error(1);

      test._("Returns true after error is called").equals(observer.closed, true);
    }).subscribe({
      error: function () {}
    });
    var observer;
    new Observable(function (x) {
      observer = x;
    }).subscribe({}).unsubscribe();

    test._("Returns true after unsubscribe is called").equals(observer.closed, true);
  }
};