"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
var getSymbol = _helpersJs.getSymbol;

/*

Not currently part of the es-observable specification

*/
module.exports = {
  "Observable.prototype has a map property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable.prototype, "map", {
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
      return observable.map();
    }, TypeError)["throws"](function (_) {
      return observable.map(null);
    }, TypeError)["throws"](function (_) {
      return observable.map({});
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

    test._("Constructor species is used as the new constructor").equals(observable.map(function (_) {}).token, token);

    observable.constructor[getSymbol("species")] = null;

    test._("An error is thrown if instance does not have a constructor species")["throws"](function (_) {
      return observable.map(function (_) {});
    }, TypeError);

    observable.constructor = null;

    test._("An error is thrown if the instance does not have a constructor")["throws"](function (_) {
      return observable.map(function (_) {});
    }, TypeError);
  },
  "The callback is used to map next values": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var values = [],
        returns = [];
    new Observable(function (observer) {
      returns.push(observer.next(1));
      returns.push(observer.next(2));
      observer.complete();
    }).map(function (x) {
      return x * 2;
    }).subscribe({
      next: function (v) {
        values.push(v);
        return -v;
      }
    });

    test._("Mapped values are sent to the observer").equals(values, [2, 4])._("Return values from the observer are returned to the caller").equals(returns, [-2, -4]);
  },
  "Errors thrown from the callback are sent to the observer": function (test, _ref5) {
    var Observable = _ref5.Observable;
    var error = new Error(),
        thrown = null,
        returned = null,
        token = {};
    new Observable(function (observer) {
      returned = observer.next(1);
    }).map(function (x) {
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
    }).map(function (x) {
      return x;
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
    }).map(function (x) {
      return x;
    }).subscribe({
      complete: function (v) {
        passed = v;
        return token;
      }
    });

    test._("Complete values are forwarded").equals(passed, arg)._("The return value of the complete method is returned to the caller").equals(returned, token);
  }
};