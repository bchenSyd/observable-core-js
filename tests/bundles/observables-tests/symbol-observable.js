"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
var getSymbol = _helpersJs.getSymbol;
module.exports = {
  "Observable.prototype has a Symbol.observable method": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable.prototype, getSymbol("observable"), {
      configurable: true,
      writable: true,
      length: 0
    });
  },
  "Return value": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var desc = Object.getOwnPropertyDescriptor(Observable.prototype, getSymbol("observable")),
        thisVal = {};

    test._("Returns the 'this' value").equals(desc.value.call(thisVal), thisVal);
  }
};