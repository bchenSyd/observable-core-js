"use strict";

var _moonUnit = require("moon-unit");

var TestRunner = _moonUnit.TestRunner;

var constructor = require("./constructor.js");

var subscribe = require("./subscribe.js");

var observable = require("./symbol-observable.js");

var ofTests = require("./of.js");

var fromTests = require("./from.js");

var observerNext = require("./observer-next.js");

var observerError = require("./observer-error.js");

var observerComplete = require("./observer-complete.js");

var observerClosed = require("./observer-closed.js");

function runTests(C) {
  return new TestRunner().inject({
    Observable: C
  }).run({
    "Observable constructor": constructor,
    "Observable.prototype.subscribe": subscribe,
    "Observable.prototype[Symbol.observable]": observable,
    "Observable.of": ofTests,
    "Observable.from": fromTests,
    "SubscriptionObserver.prototype.next": observerNext,
    "SubscriptionObserver.prototype.error": observerError,
    "SubscriptionObserver.prototype.complete": observerComplete,
    "SubscriptionObserver.prototype.closed": observerClosed
  });
}

exports.runTests = runTests;