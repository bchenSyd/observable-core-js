"use strict";

var _helpersJs = require("./helpers.js");

var testMethodProperty = _helpersJs.testMethodProperty;
// TODO: Verify that Observable.from subscriber returns a cleanup function
module.exports = {
  "Observable has an of property": function (test, _ref) {
    var Observable = _ref.Observable;
    testMethodProperty(test, Observable, "of", {
      configurable: true,
      writable: true,
      length: 0
    });
  },
  "Uses the this value if it's a function": function (test, _ref2) {
    var Observable = _ref2.Observable;
    var usesThis = false;
    Observable.of.call(function (_) {
      usesThis = true;
    });

    test._("Observable.of will use the 'this' value if it is callable").equals(usesThis, true);
  },
  "Uses 'Observable' if the 'this' value is not a function": function (test, _ref3) {
    var Observable = _ref3.Observable;
    var result = Observable.of.call({}, 1, 2, 3, 4);

    test._("Observable.of will use 'Observable' if the this value is not callable").assert(result instanceof Observable);
  },
  "Arguments are delivered to next": function (test, _ref4) {
    var Observable = _ref4.Observable;
    var values = [],
        turns = 0;
    Observable.of(1, 2, 3, 4).subscribe({
      next: function (v) {
        values.push(v);
      },
      complete: function () {
        test._("All items are delivered and complete is called").equals(values, [1, 2, 3, 4]);
      }
    });
  }
};