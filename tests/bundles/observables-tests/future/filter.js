"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
var getSymbol = _helpersJs.getSymbol;

/*

Not currently part of the es-observable specification

*/
module.exports = {
  "Observable.prototype has a filter property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable.prototype, "filter", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Allowed arguments": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var observable = new Observable(function (_) {
      return null;
    });

    test._("Argument must be a function")["throws"](function (_) {
      return observable.filter();
    }, TypeError)["throws"](function (_) {
      return observable.filter(null);
    }, TypeError)["throws"](function (_) {
      return observable.filter({});
    }, TypeError);
  },
  "Species is used to determine the constructor": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var observable = new Observable(function (_) {
      return null;
    }),
        token = {};

    function species() {
      this.token = token;
    }

    observable.constructor = function () {};

    observable.constructor[getSymbol("species")] = species;

    test._("Constructor species is used as the new constructor").equals(observable.filter(function (_) {}).token, token);

    observable.constructor[getSymbol("species")] = null;

    test._("An error is thrown if instance does not have a constructor species")["throws"](function (_) {
      return observable.filter(function (_) {});
    }, TypeError);

    observable.constructor = null;

    test._("An error is thrown if the instance does not have a constructor")["throws"](function (_) {
      return observable.filter(function (_) {});
    }, TypeError);
  },
  "The callback is used to filter next values": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var values = [],
        returns = [];
    new Observable(function (observer) {
      returns.push(observer.next(1));
      returns.push(observer.next(2));
      returns.push(observer.next(3));
      returns.push(observer.next(4));
      observer.complete();
    }).filter(function (x) {
      return x % 2;
    }).subscribe({
      next: function (v) {
        values.push(v);
        return -v;
      }
    });

    test._("Filtered values are sent to the observer").equals(values, [1, 3])._("Return values from the observer are returned to the caller").equals(returns, [-1, undefined, -3, undefined]);
  },
  "Errors thrown from the callback are sent to the observer": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var error = new Error(),
        thrown = null,
        returned = null,
        token = {};
    new Observable(function (observer) {
      returned = observer.next(1);
    }).filter(function (x) {
      throw error;
    }).subscribe({
      error: function (e) {
        thrown = e;
        return token;
      }
    });

    test._("Exceptions from callback are sent to the observer").equals(thrown, error)._("The result of calling error is returned to the caller").equals(returned, token);
  },
  "Errors are forwarded to the observer": function (test, _ref6) {
    var Observable = _ref6.Observable;
    var error = new Error(),
        thrown = null,
        returned = null,
        token = {};
    new Observable(function (observer) {
      returned = observer.error(error);
    }).filter(function (x) {
      return true;
    }).subscribe({
      error: function (e) {
        thrown = e;
        return token;
      }
    });

    test._("Error values are forwarded").equals(thrown, error)._("The return value of the error method is returned to the caller").equals(returned, token);
  },
  "Complete is forwarded to the observer": function (test, _ref7) {
    var Observable = _ref7.Observable;
    var arg = {},
        passed = null,
        returned = null,
        token = {};
    new Observable(function (observer) {
      returned = observer.complete(arg);
    }).filter(function (x) {
      return true;
    }).subscribe({
      complete: function (v) {
        passed = v;
        return token;
      }
    });

    test._("Complete values are forwarded").equals(passed, arg)._("The return value of the complete method is returned to the caller").equals(returned, token);
  }
};