"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
var hasSymbol = _helpersJs.hasSymbol;
var getSymbol = _helpersJs.getSymbol;

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

// TODO: Verify that Observable.from subscriber returns a cleanup function
module.exports = {
  "Observable has a from property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable, "from", {
      configurable: true,
      writable: true,
      length: 1
    });
  },
  "Allowed argument types": function (test, _ref2) {
    var Observable = _ref2.Observable;

    test._("Null is not allowed")["throws"](function (_) {
      return Observable.from(null);
    }, TypeError)._("Undefined is not allowed")["throws"](function (_) {
      return Observable.from(undefined);
    }, TypeError)["throws"](function (_) {
      return Observable.from();
    }, TypeError);
  },
  "Uses the this value if it's a function": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var usesThis = false;
    Observable.from.call(function (_) {
      usesThis = true;
    }, []);

    test._("Observable.from will use the 'this' value if it is callable").equals(usesThis, true);
  },
  "Uses 'Observable' if the 'this' value is not a function": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var result = Observable.from.call({}, []);

    test._("Observable.from will use 'Observable' if the this value is not callable").assert(result instanceof Observable);
  },
  "Symbol.observable method is accessed": function (test, _ref5) {
    var _getSymbol, _Observable$from, _mutatorMap, _Observable$from6;

    var Observable = _ref5.Observable;
    var called = 0;
    Observable.from((_Observable$from = {}, _getSymbol = getSymbol("observable"), _mutatorMap = {}, _mutatorMap[_getSymbol] = _mutatorMap[_getSymbol] || {}, _mutatorMap[_getSymbol].get = function () {
      called++;
      return function (_) {
        return {};
      };
    }, _defineEnumerableProperties(_Observable$from, _mutatorMap), _Observable$from));

    test._("Symbol.observable property is accessed once").equals(called, 1);

    test._("Symbol.observable must be a function")["throws"](function (_) {
      var _Observable$from2;

      return Observable.from((_Observable$from2 = {}, _Observable$from2[getSymbol("observable")] = {}, _Observable$from2));
    }, TypeError)["throws"](function (_) {
      var _Observable$from3;

      return Observable.from((_Observable$from3 = {}, _Observable$from3[getSymbol("observable")] = 0, _Observable$from3));
    }, TypeError)["throws"](function (_) {
      var _Observable$from4;

      return Observable.from((_Observable$from4 = {}, _Observable$from4[getSymbol("observable")] = null, _Observable$from4));
    }, TypeError)["throws"](function (_) {
      var _Observable$from5;

      return Observable.from((_Observable$from5 = {}, _Observable$from5[getSymbol("observable")] = undefined, _Observable$from5));
    }, TypeError);

    called = 0;
    Observable.from((_Observable$from6 = {}, _Observable$from6[getSymbol("observable")] = function () {
      called++;
      return {};
    }, _Observable$from6));

    test._("Calls the Symbol.observable method").equals(called, 1);
  },
  "Return value of Symbol.observable": function (test, _ref6) {
    var _Observable$from$call, _Observable$from$call2;

    var Observable = _ref6.Observable;

    test._("Throws if the return value of Symbol.observable is not an object")["throws"](function (_) {
      var _Observable$from7;

      return Observable.from((_Observable$from7 = {}, _Observable$from7[getSymbol("observable")] = function () {
        return 0;
      }, _Observable$from7));
    }, TypeError)["throws"](function (_) {
      var _Observable$from8;

      return Observable.from((_Observable$from8 = {}, _Observable$from8[getSymbol("observable")] = function () {
        return null;
      }, _Observable$from8));
    }, TypeError)["throws"](function (_) {
      var _Observable$from9;

      return Observable.from((_Observable$from9 = {}, _Observable$from9[getSymbol("observable")] = function () {}, _Observable$from9));
    }, TypeError).not()["throws"](function (_) {
      var _Observable$from10;

      return Observable.from((_Observable$from10 = {}, _Observable$from10[getSymbol("observable")] = function () {
        return {};
      }, _Observable$from10));
    }).not()["throws"](function (_) {
      var _getSymbol2, _Observable$from11, _mutatorMap2;

      return Observable.from((_Observable$from11 = {}, _getSymbol2 = getSymbol("observable"), _mutatorMap2 = {}, _mutatorMap2[_getSymbol2] = _mutatorMap2[_getSymbol2] || {}, _mutatorMap2[_getSymbol2].get = function () {
        return function (_) {
          return {};
        };
      }, _defineEnumerableProperties(_Observable$from11, _mutatorMap2), _Observable$from11));
    });

    var target = function () {},
        returnValue = {
      constructor: target
    };

    var result = Observable.from.call(target, (_Observable$from$call = {}, _Observable$from$call[getSymbol("observable")] = function () {
      return returnValue;
    }, _Observable$from$call));

    test._("Returns the result of Symbol.observable if the object's constructor property " + "is the target").equals(result, returnValue);

    var input = null,
        token = {};

    target = function (fn) {
      this.fn = fn;
      this.token = token;
    };

    result = Observable.from.call(target, (_Observable$from$call2 = {}, _Observable$from$call2[getSymbol("observable")] = function () {
      return {
        subscribe: function (x) {
          input = x;
          return token;
        }
      };
    }, _Observable$from$call2));

    test._("Calls the constructor if returned object does not have matching constructor " + "property").equals(result.token, token)._("Constructor is called with a function").equals(typeof result.fn, "function")._("Calling the function calls subscribe on the object and returns the result").equals(result.fn && result.fn(123), token)._("The subscriber argument is supplied to the subscribe method").equals(input, 123);
  },
  "Iterables: values are delivered to next": function (test, _ref7) {
    var Observable = _ref7.Observable;
    var values = [],
        turns = 0,
        iterable = [1, 2, 3, 4];
    if (hasSymbol("iterator")) iterable = iterable[Symbol.iterator]();
    Observable.from(iterable).subscribe({
      next: function (v) {
        values.push(v);
      },
      complete: function () {
        test._("All items are delivered and complete is called").equals(values, [1, 2, 3, 4]);
      }
    });
  },
  "Non-convertibles throw": function (test, _ref8) {
    var Observable = _ref8.Observable;

    test._("If argument is not observable or iterable, subscribe throws")["throws"](function (_) {
      return Observable.from({}).subscribe({});
    }, TypeError);
  }
};