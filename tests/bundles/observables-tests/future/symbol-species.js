"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
var getSymbol = _helpersJs.getSymbol;
module.exports = {
  "Observable has a species method": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable, getSymbol("species"), {
      get: true,
      configurable: true
    });
  },
  "Return value": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var desc = Object.getOwnPropertyDescriptor(Observable, getSymbol("species")),
        thisVal = {};

    test._("Returns the 'this' value").equals(desc.get.call(thisVal), thisVal);
  }
};