"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
module.exports = {
  "Observable should be called as a constructor with new operator": function (test, _ref) {
    var Observable = _ref.Observable;

    test._("It cannot be called as a function")["throws"](function (_) {
      return Observable(function () {});
    }, TypeError)["throws"](function (_) {
      return Observable.call({}, function () {});
    }, TypeError);
  },
  "Argument types": function (test, _ref2) {
    var Observable = _ref2.Observable;

    test._("The first argument cannot be a non-callable object")["throws"](function (_) {
      return new Observable({});
    }, TypeError)._("The first argument cannot be a primative value")["throws"](function (_) {
      return new Observable(false);
    }, TypeError)["throws"](function (_) {
      return new Observable(null);
    }, TypeError)["throws"](function (_) {
      return new Observable(undefined);
    }, TypeError)["throws"](function (_) {
      return new Observable(1);
    }, TypeError)._("The first argument can be a function").not()["throws"](function (_) {
      return new Observable(function () {});
    });
  },
  "Observable.prototype has a constructor property": function (test, _ref3) {
    var Observable = _ref3.Observable;
    testMethodProperty(test, Observable.prototype, "constructor", {
      configurable: true,
      writable: true,
      length: 1
    });

    test._("Observable.prototype.constructor === Observable").equals(Observable.prototype.constructor, Observable);
  },
  "Subscriber function is not called by constructor": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var called = 0;
    new Observable(function (_) {
      return called++;
    });

    test._("The constructor does not call the subscriber function").equals(called, 0);
  }
};